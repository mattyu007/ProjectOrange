"""
Manage the creation, edition and deletion of decks.
Also, handle the flagging of cards for review.
"""

import json
import logging

from config import StatusCode
from utils.base_handler import BaseHandler
from utils.identity import generate_uuid
from utils.serializer import serializer
from utils.wrappers import authorize_request_and_create_db_connector, require_params, \
    require_query_string_params, extract_user_id, optional_params


class DeckAddHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('name', 'tags', 'cards')
    def post(self, name, tags, cards, user_id, connector):
        """Create a new deck."""
        deck_id = generate_uuid()
        try:
            connector.begin_transaction()
            connector.call_procedure('CREATE_DECK', deck_id, name, user_id)

            # Create tags and associate them with the deck.
            for tag in tags:
                if not isinstance(tag, (str, unicode)):
                    raise TypeError
                tag_id = connector.call_procedure('CREATE_TAG', tag)[0]['id']
                connector.call_procedure('ADD_TAG_TO_DECK', tag_id, deck_id)

            # Create cards for the deck.
            for index in xrange(len(cards)):
                if not isinstance(cards[index], dict):
                    raise TypeError

                # Create a new card.
                connector.call_procedure('CREATE_CARD', generate_uuid(), deck_id,
                    cards[index].get('front'), cards[index].get('back'), index)

            # Commit the deck.
            connector.end_transaction()

        except TypeError:
            connector.abort_transaction()
            return self.make_response(response='Invalid argument format',
                status=StatusCode.UNSUPPORTED_MEDIA_TYPE)
        except:
            connector.abort_transaction()
            logging.error('Could not create new deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        logging.info('{} created new deck {}'.format(user_id, deck_id))

        # Retrieve the deck as stored in the DB.
        deck = connector.call_procedure('FETCH_DECK', user_id, deck_id)[0]
        deck['cards'] = connector.call_procedure('FETCH_CARDS', deck_id)
        deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck_id))

        # Return the deck to the user.
        return self.make_response(response=json.dumps(deck, default=serializer),
            status=StatusCode.CREATED)


class DeckUUIDHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector, uuid):
        """Retrieve a full deck via its UUID."""
        results = connector.call_procedure('FETCH_DECK', user_id, uuid)
        if len(results) != 1:
            return self.make_response(status=StatusCode.NOT_FOUND)

        deck = results[0]
        deck['cards'] = connector.call_procedure('FETCH_CARDS', uuid)
        deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', uuid))

        # Return the full deck to the user.
        return self.make_response(response=json.dumps(deck, default=serializer),
            status=StatusCode.OK)

    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('parent_deck_version', 'parent_user_data_version')
    @optional_params('name', 'public', 'tags', 'actions')
    def put(self, name, public, tags, actions, parent_deck_version, parent_user_data_version,
            user_id, connector, uuid):
        """Edit an existing deck."""

        # Ensure this user actually owns the deck.
        results = connector.call_procedure('FETCH_DECK', user_id, uuid)
        if len(results) != 1:
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)
        if results[0]['owner'] != user_id:
            return self.make_response(status=StatusCode.FORBIDDEN)

        # Make sure the deck version are consistent.
        versions = connector.call_procedure('GET_VERSIONS', user_id, uuid)
        if len(versions) != 1:
            return self.make_response(status=StatusCode.NOT_FOUND)
        if (versions[0]['user_data_version'] != parent_user_data_version or
                versions[0]['deck_version'] != parent_deck_version):
            return self.make_response(response=json.dumps(versions[0]), status=StatusCode.CONFLICT)

        # Begin deck edits
        try:
            connector.begin_transaction()

            # Collect and validate metadata updates.
            metadata_edits = {}
            if name is not None:
                if not isinstance(name, (str, unicode)):
                    raise TypeError
                metadata_edits['name'] = name
            if public is not None:
                if not isinstance(public, bool):
                    raise TypeError
                metadata_edits['public'] = public

            # Update metadata.
            query_str = 'UPDATE Deck SET {key}=%s WHERE uuid=%s'
            for k, v in metadata_edits.iteritems():
                connector.query(query_str.format(key=k), v, uuid)

            # Update tags.
            if tags is not None:

                # Clear existing tags from the deck.
                connector.call_procedure('CLEAR_TAGS_FROM_DECK', uuid)

                for tag in tags:
                    if not isinstance(tag, (str, unicode)):
                        raise TypeError
                    tag_id = connector.call_procedure('CREATE_TAG', tag)[0]['id']
                    connector.call_procedure('ADD_TAG_TO_DECK', tag_id, uuid)

            # Edit cards.
            if actions is not None:
                for action in actions:
                    if action['action'] == 'add':
                        connector.call_procedure(
                            'CREATE_CARD_AND_UPDATE_POSITIONS', generate_uuid(), uuid,
                            action['front'], action['back'], action['position'])
                    elif action['action'] == 'edit':
                        connector.call_procedure('EDIT_CARD', action['card_id'], uuid,
                            action['front'], action['back'], action['position'])
                    elif action['action'] == 'delete':
                        connector.call_procedure('DELETE_CARD_AND_UPDATE_POSITIONS', action['card_id'], uuid)
                        connector.call_procedure('UNFLAG_CARD', action['card_id'], user_id)
                    else:
                        raise TypeError  # no valid action specified

                    # Check if the card should be marked for review.
                    needs_review = action.get('needs_review')
                    if needs_review is not None:
                        if not isinstance(needs_review, bool):
                            raise TypeError

                        # Flag/Unflag cards accordingly
                        if needs_review is True:
                            connector.call_procedure('FLAG_CARD', action['card_id'], user_id)
                        else:
                            connector.call_procedure('UNFLAG_CARD', action['card_id'], user_id)

            # Increment both the deck version and the user data version.
            # TODO set last_update and last_update_device.
            connector.call_procedure('INCREMENT_DECK_VERSION', user_id, uuid)
            connector.call_procedure('INCREMENT_USER_DATA_VERSION', user_id, uuid)

            # Commit changes.
            connector.end_transaction()
        except (KeyError, TypeError):
            connector.abort_transaction()
            return self.make_response(status=StatusCode.BAD_REQUEST)
        except:
            connector.abort_transaction()
            logging.error('Could not edit deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        logging.info('{} edited deck {}'.format(user_id, uuid))

        deck = results[0]
        deck['cards'] = connector.call_procedure('FETCH_CARDS', uuid)
        deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', uuid))

        # Return the full deck to the user.
        return self.make_response(response=json.dumps(deck, default=serializer),
            status=StatusCode.OK)


class DeckFlagHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('parent_deck_version', 'parent_user_data_version', 'actions')
    def put(self, parent_deck_version, parent_user_data_version, actions, user_id, connector, uuid):
        """Flag specific cards in an existing deck."""

        versions = connector.call_procedure('GET_VERSIONS', user_id, uuid)
        if len(versions) != 1:
            return self.make_response(status=StatusCode.NOT_FOUND)

        if (versions[0]['user_data_version'] != parent_user_data_version or
                versions[0]['deck_version'] != parent_deck_version):
            return self.make_response(response=json.dumps(versions[0]), status=StatusCode.CONFLICT)

        new_user_data_version = None
        try:
            connector.begin_transaction()
            for action in actions:
                if not isinstance(action, dict) or not isinstance(action.get('needs_review'), bool):
                    raise TypeError

                # Mark and unmark cards as necessary.
                if action['needs_review'] is True:
                    connector.call_procedure('FLAG_CARD', action['card_id'], user_id)
                else:
                    connector.call_procedure('UNFLAG_CARD', action['card_id'], user_id)

            # Increment the user data version and retrieve it.
            new_user_data_version = connector.call_procedure(
                'INCREMENT_USER_DATA_VERSION', user_id, uuid)[0]

            # Commit the changes.
            connector.end_transaction()

        except (TypeError, KeyError):
            connector.abort_transaction()
            return self.make_response(status=StatusCode.BAD_REQUEST)
        except:
            connector.abort_transaction()
            logging.error('Could not mark cards for review', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        # Return the new user data version.
        return self.make_response(response=json.dumps(new_user_data_version))


class DeckRateHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('rating')
    def post(self, rating, user_id, connector, uuid):
        """Rate existing decks."""
        if not isinstance(rating, int) or (rating != -1 and rating != 1):
            return self.make_response(response='Invalid rating', status=StatusCode.BAD_REQUEST)

        # Undo any existing old rating before applying a new one.
        connector.begin_transaction()
        connector.call_procedure('UNRATE_DECK', user_id, uuid)
        connector.call_procedure('RATE_DECK', user_id, uuid, rating)
        connector.end_transaction()

        logging.info('{} rated deck {}'.format(user_id, uuid))
        return self.make_response(status=StatusCode.OK)


routes = [
    ('/v1/deck/add', DeckAddHandler),
    ('/v1/deck/<string:uuid>', DeckUUIDHandler),
    ('/v1/deck/<string:uuid>/flag', DeckFlagHandler),
    ('/v1/deck/<string:uuid>/rate', DeckRateHandler)
]

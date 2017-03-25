"""
Manage the creation, edition and deletion of decks.
Also, handle the flagging of cards for review.
"""

import json
import logging

from config import StatusCode
from model.card import Card
from model.deck import Deck
from policy.card import CardPolicy
from policy.deck import DeckPolicy
from model.library import Library
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, require_params, \
    extract_user_id, optional_params, optional_query_string_params


class DeckAddHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('name', 'tags', 'cards', 'device')
    def post(self, name, tags, cards, device, user_id, connector):
        """Create a new deck."""
        deck = None
        try:
            deck = Deck.create(name, user_id, device, tags, cards, connector)
        except TypeError:
            return self.make_response(response='Invalid argument format',
                                      status=StatusCode.UNSUPPORTED_MEDIA_TYPE)
        except:
            logging.error('Could not create new deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        logging.info('{} created new deck {}'.format(user_id, deck.uuid))

        # Return the deck to the user.
        return self.make_response(response=deck.full_deck_to_json(user_id),
                                  status=StatusCode.CREATED)


class DeckUUIDHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @optional_query_string_params('share_code')
    def get(self, share_code, user_id, connector, uuid):
        """Retrieve a full deck via its UUID."""
        deck = DeckPolicy.can_view(uuid, user_id, share_code, connector=connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        # Return the full deck
        return self.make_response(response=deck.full_deck_to_json(user_id))

    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('parent_deck_version', 'parent_user_data_version', 'device')
    @optional_params('name', 'public', 'unshare', 'tags', 'actions')
    def put(self, name, public, unshare, tags, actions, parent_deck_version, parent_user_data_version, device,
            user_id, connector, uuid):
        """Edit an existing deck."""

        deck = DeckPolicy.can_edit(uuid, user_id, connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        # Make sure there are no version conflicts.
        metadata = deck.get_metadata(user_id)
        if (metadata['user_data_version'] != parent_user_data_version or
                metadata['deck_version'] != parent_deck_version):
            return self.make_response(
                response=json.dumps({
                    'user_data_version': metadata['user_data_version'],
                    'deck_version': metadata['deck_version']
                }),
                status=StatusCode.CONFLICT)

        # Begin deck edits
        try:
            connector.begin_transaction()

            # Set metadata attributes
            if name is not None:
                deck.set_name(name)
            if public is not None:
                deck.set_public(public)
            if unshare is True:
                deck.nullify_share_code()
            if tags is not None:
                deck.set_tags(tags)

            # Complete card actions
            if actions is not None:
                for action in actions:
                    if action['action'] == 'add':
                        action['card_id'] = Card.create(deck.uuid, action['front'], action['back'],
                                                        action['position'], connector=connector).uuid
                    elif action['action'] == 'edit':
                        card = CardPolicy.belongs_to(action['card_id'], deck.uuid, connector)
                        if card is None:
                            raise ValueError  # card does not belong to deck

                        # Make edits.
                        if action.get('front') is not None or action.get('back') is not None:
                            card.edit(deck.uuid, action.get('front'), action.get('back'))

                        # Move card.
                        if action.get('position') is not None:
                            card.move(deck.uuid, action['position'])

                    elif action['action'] == 'delete':
                        card = CardPolicy.belongs_to(action['card_id'], deck.uuid, connector)
                        if card is None:
                            raise ValueError  # card does not belong to deck
                        card.delete(deck.uuid)
                    else:
                        raise TypeError  # no valid action specified

                    if action.get('needs_review') is not None:
                        Card(action['card_id'], connector=connector).needs_review(action['needs_review'], user_id)

            # Update deck versions.
            deck.update_deck_version()
            deck.update_user_version(user_id, device)
            connector.end_transaction()

        except (KeyError, TypeError, ValueError):
            connector.abort_transaction()
            return self.make_response(status=StatusCode.BAD_REQUEST)
        except:
            connector.abort_transaction()
            logging.error('Could not edit deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        logging.info('{} edited deck {}'.format(user_id, uuid))

        # Return the full deck to the user.
        return self.make_response(response=deck.full_deck_to_json(user_id))

    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('name', 'public', 'deleted', 'tags', 'cards', 'device')
    def post(self, name, public, deleted, tags, cards, device, user_id, connector, uuid):
        """Overwrite an existing deck."""

        deck = DeckPolicy.can_edit(uuid, user_id, connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        # Begin deck overwrite.
        try:
            connector.begin_transaction()

            # Collect and validate metadata updates.
            if not isinstance(name, (str, unicode)):
                raise TypeError
            if not isinstance(public, bool):
                raise TypeError
            if not isinstance(tags, list):
                raise TypeError
                
            deck.set_name(name)
            deck.set_public(public)
            deck.set_tags(tags)

            deck_metadata = deck.get_metadata(user_id)
            library = Library(user_id, connector=connector)
            
            if deleted and not deck_metadata['deleted']: 
                library.remove(uuid)
                connector.end_transaction()
                return self.make_response(response=deck.full_deck_to_json(user_id))

            if not deleted and deck_metadata['deleted']:
                deck.set_delete_flag(False)
                library.add(uuid, device, 'private')

            # Determine which cards need to be deleted.
            original_cards = deck.get_cards(user_id)
            original_ids = [card['uuid'] for card in original_cards]
            new_ids = [card['uuid'] for card in cards]
            deleted_ids = set(original_ids).difference(new_ids)
            for deleted_id in deleted_ids:
                Card(deleted_id).delete(deck.uuid)

            # Edit cards.
            for card in cards:
                card_obj = None
                if (card['uuid'] is None):
                    card_obj = Card.create(deck.uuid, card['front'], card['back'], card['position'],
                                           connector=connector)
                else:
                    card_obj = CardPolicy.belongs_to(card['uuid'], deck.uuid, connector)
                    if card_obj is None:
                        raise ValueError  # not allowed to edit this card

                    card_obj.edit(deck.uuid, card['front'], card['back'])
                    card_obj.move(deck.uuid, card['position'])

                # Mark for review.
                if card.get('needs_review') is not None and card_obj is not None:
                    card_obj.needs_review(card['needs_review'], user_id)

            # Update deck versions.
            deck.update_deck_version()
            deck.update_user_version(user_id, device)
            connector.end_transaction()

        except (KeyError, TypeError, ValueError):
            connector.abort_transaction()
            return self.make_response(status=StatusCode.BAD_REQUEST)
        except:
            connector.abort_transaction()
            logging.error('Could not overwrite deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        logging.info('{} overwrote deck {}'.format(user_id, uuid))

        # Return the full deck to the user.
        return self.make_response(response=deck.full_deck_to_json(user_id))


class DeckFlagHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('parent_deck_version', 'parent_user_data_version', 'actions', 'device')
    def put(self, parent_deck_version, parent_user_data_version, actions, device, user_id, connector, uuid):
        """Flag specific cards in an existing deck."""

        deck = DeckPolicy.in_library(uuid, user_id, connector=connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        # Make sure there are no version conflicts.
        metadata = deck.get_metadata(user_id)
        if (metadata['user_data_version'] != parent_user_data_version or
                metadata['deck_version'] != parent_deck_version):
            return self.make_response(
                response=json.dumps({
                    'user_data_version': metadata['user_data_version'],
                    'deck_version': metadata['deck_version']
                }),
                status=StatusCode.CONFLICT)

        try:
            connector.begin_transaction()
            for action in actions:
                card = CardPolicy.belongs_to(action['card_id'], deck.uuid, connector=connector)
                if card is None:
                    raise ValueError  # card is not from this deck
                card.needs_review(action['needs_review'], user_id)

            # Increment the user data version.
            deck.update_user_version(user_id, device)

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
        metadata = deck.get_metadata(user_id)
        return self.make_response(response=json.dumps({
            'user_data_version': metadata['user_data_version']
        }))


class DeckRateHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('rating')
    def post(self, rating, user_id, connector, uuid):
        """Rate existing decks."""

        deck = DeckPolicy.can_view(uuid, user_id, connector=connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        if not isinstance(rating, int) or (rating != -1 and rating != 1):
            return self.make_response(status=StatusCode.BAD_REQUEST)

        deck.rate(user_id, rating)

        logging.info('{} rated deck {}'.format(user_id, uuid))
        return self.make_response(status=StatusCode.OK)


class DeckShareHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector, uuid):
        """Generate a share code for a deck."""

        deck = DeckPolicy.owned_by(uuid, user_id, connector=connector)
        share_code = deck.get_share_code()
        return self.make_response(response=json.dumps({'share_code': share_code}))


class DeckShareCodeFetchHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector, code):
        """Retrieve a deck UUID via share code."""

        deck = Deck.get_by_share_code(code, connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)
        return self.make_response(response=json.dumps({'uuid': deck.uuid}))


routes = [
    ('/v1/deck/add', DeckAddHandler),
    ('/v1/deck/<string:uuid>', DeckUUIDHandler),
    ('/v1/deck/<string:uuid>/flag', DeckFlagHandler),
    ('/v1/deck/<string:uuid>/rate', DeckRateHandler),
    ('/v1/deck/<string:uuid>/code', DeckShareHandler),
    ('/v1/deck/uuid/<string:code>', DeckShareCodeFetchHandler)
]

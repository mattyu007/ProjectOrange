import json
import logging

from config import StatusCode
from utils.serializer import serializer
from utils.identity import generate_uuid
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, extract_user_id, require_params


class LibraryHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector):
        """Return metadata for all the decks in a user's library."""
        
        # Retrieve user's.
        library = connector.call_procedure('FETCH_LIBRARY', user_id)

        for deck in library:
            deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck["uuid"]))
            

        # Return library to the user.
        return self.make_response(response=json.dumps(library, default=serializer),
            status=StatusCode.OK)


class LibraryAddHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid')
    @extract_user_id
    def post(self, user_id, uuid, connector):
        """Add a remote deck to a user's library."""

        try:
            connector.begin_transaction()

            results = connector.call_procedure('FETCH_DECK', user_id, uuid)
            if len(results) != 1:
                return self.make_response(status=StatusCode.NOT_FOUND)

            deck = results[0]

            if (not deck['public'] and deck['owner'] != user_id):
                return self.make_response(status=StatusCode.UNAUTHORIZED)

            connector.call_procedure('LIBRARY_ADD', user_id, uuid)

        except:
            connector.abort_transaction()
            logging.error('Could not add deck to library', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        return self.make_response(status=StatusCode.OK)


class LibraryCopyHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid')
    @extract_user_id
    def post(self, user_id, uuid, connector):
        """Copy a remote deck into a user's library."""
        deck_id = generate_uuid();

        try:
            connector.begin_transaction()

            results = connector.call_procedure('FETCH_DECK', user_id, uuid)
            if len(results) != 1:
                return self.make_response(status=StatusCode.NOT_FOUND)

            deck = results[0]
            deck['cards'] = connector.call_procedure('FETCH_CARDS', uuid)
            deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', uuid))

            connector.call_procedure('CREATE_DECK', deck_id, deck['name'], user_id)

            for tag in deck['tags']:
                tag_id = connector.call_procedure('CREATE_TAG', tag)[0]['id']
                connector.call_procedure('ADD_TAG_TO_DECK', tag_id, deck_id)

            for card in deck['cards']:
                # Create a new card.
                connector.call_procedure('CREATE_CARD', generate_uuid(), deck_id,
                    card['front'], card['back'], card['position'])

            connector.end_transaction()
        except:
            connector.abort_transaction()
            logging.error('Could not copy deck', exc_info=True)
            return self.make_response(status=StatusCode.INTERNAL_SERVER_ERROR)

        
        logging.info('{} created new deck {}'.format(user_id, deck_id))

        # Retrieve the deck as stored in the DB.
        deck = connector.call_procedure('FETCH_DECK', user_id, deck_id)[0]
        deck['cards'] = connector.call_procedure('FETCH_CARDS', deck_id)
        deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck_id))

        # Return the deck to the user.
        return self.make_response(response=json.dumps(deck, default=serializer),
            status=StatusCode.CREATED)



class LibraryDeckRemoveHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def delete(self, user_id, connector, uuid):
        """Remove a deck from a user's library and delete it if they are the owner."""

        connector.call_procedure('LIBRARY_REMOVE', user_id, uuid)

        return self.make_response(status=StatusCode.OK)


routes = [
    ('/v1/library', LibraryHandler),
    ('/v1/library/add', LibraryAddHandler),
    ('/v1/library/copy', LibraryCopyHandler),
    ('/v1/library/<string:uuid>', LibraryDeckRemoveHandler)
]

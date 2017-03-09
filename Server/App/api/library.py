import logging

from config import StatusCode
from model.library import Library
from policy.deck import DeckPolicy
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, extract_user_id, \
    require_params, optional_params


class LibraryHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector):
        """Return metadata for all the decks in a user's library."""

        return self.make_response(response=Library(user_id, connector=connector).to_json())


class LibraryAddHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid')
    @optional_params('share_code')
    @extract_user_id
    def post(self, user_id, share_code, uuid, connector):
        """Add a remote deck to a user's library."""

        deck = DeckPolicy.can_view(uuid, user_id, share_code, connector=connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        library = Library(user_id, connector=connector)
        library.add(deck.uuid)

        return self.make_response(status=StatusCode.OK)


class LibraryCopyHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid', 'device')
    @extract_user_id
    def post(self, user_id, uuid, device, connector):
        """Copy a remote deck into a user's library."""

        deck = (DeckPolicy.can_view(uuid, user_id, connector=connector) or
                DeckPolicy.in_library(uuid, user_id, connector=connector))
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        library = Library(user_id, connector=connector)
        new_deck = library.copy(deck, device)
        logging.info('{} created new deck {}'.format(user_id, new_deck.uuid))

        # Return the deck to the user.
        return self.make_response(response=new_deck.full_deck_to_json(user_id),
                                  status=StatusCode.CREATED)


class LibraryDeckRemoveHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def delete(self, user_id, connector, uuid):
        """Remove a deck from a user's library and delete it if they are the owner."""

        deck = DeckPolicy.in_library(uuid, user_id, connector=connector)
        if deck is None:
            return self.make_response(status=StatusCode.NOT_FOUND)

        library = Library(user_id, connector=connector)
        library.remove(deck.uuid)
        return self.make_response(status=StatusCode.OK)


routes = [
    ('/v1/library', LibraryHandler),
    ('/v1/library/add', LibraryAddHandler),
    ('/v1/library/copy', LibraryCopyHandler),
    ('/v1/library/<string:uuid>', LibraryDeckRemoveHandler)
]

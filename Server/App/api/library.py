"""
XXX NOTE TODO
"""

from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, extract_user_id, require_params


class LibraryHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector):
        """Return metadata for all the decks in a user's library."""
        self.abort(404)


class LibraryAddHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid')
    @extract_user_id
    def post(self, user_id, uuid, connector):
        """Add a remote deck to a user's library."""
        self.abort(404)


class LibraryCopyHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_params('uuid')
    @extract_user_id
    def post(self, user_id, uuid, connector):
        """Copy a remote deck into a user's library."""
        self.abort(404)


class LibraryDeckRemoveHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @extract_user_id
    def delete(self, user_id, connector, uuid):
        """Remove a deck from a user's library and delete it if they are the owner."""
        self.abort(404)


routes = [
    ('/v1/library', LibraryHandler),
    ('/v1/library/add', LibraryAddHandler),
    ('/v1/library/copy', LibraryCopyHandler),
    ('/v1/library/<string:uuid>', LibraryDeckRemoveHandler)
]

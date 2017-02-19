"""
XXX NOTE TODO
"""

from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, require_query_string_params


class TopHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    def get(self, connector):
        """Retrieve metadata for the most popular decks."""
        self.abort(404)


class NewHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    def get(self, connector):
        """Retrieve metadata for newest decks."""
        self.abort(404)


class SearchHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_query_string_params('query')
    def get(self, query, connector):
        """Retrieve metadata for decks matching the search string."""
        self.abort(404)


routes = [
    ('/v1/discover/top', TopHandler),
    ('/v1/discover/new', NewHandler),
    ('/v1/disocver/search', SearchHandler)
]

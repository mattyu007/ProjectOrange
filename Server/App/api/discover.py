from model.discover import Discover
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, require_query_string_params, \
    optional_query_string_params, extract_user_id


class TopHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @optional_query_string_params('page')
    @extract_user_id
    def get(self, user_id, page, connector):
        """Retrieve metadata for the most popular decks."""

        return self.make_response(response=Discover(user_id, connector).top_to_json(page))


class NewHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @optional_query_string_params('page')
    @extract_user_id
    def get(self, user_id, page, connector):
        """Retrieve metadata for newest decks."""

        return self.make_response(response=Discover(user_id, connector).new_to_json(page))


class SearchHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_query_string_params('query')
    @optional_query_string_params('page')
    @extract_user_id
    def get(self, user_id, page, query, connector):
        """Retrieve metadata for decks matching the search string."""

        return self.make_response(response=Discover(user_id, connector).search_to_json(query, page))


routes = [
    ('/v1/discover/top', TopHandler),
    ('/v1/discover/new', NewHandler),
    ('/v1/discover/search', SearchHandler)
]

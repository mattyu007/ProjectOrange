import json
import logging

from config import StatusCode
from utils.serializer import serializer
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, require_query_string_params

class TopHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_query_string_params('page')
    def get(self, page, connector):
        """Retrieve metadata for the most popular decks."""

        # Retrieve a page of deck's metadata.
        decks = connector.call_procedure('FETCH_DECKS', 'top' , page)

        for deck in decks:
            deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck["uuid"]))
            

        # Return search results to the user.
        return self.make_response(response=json.dumps(decks, default=serializer),
            status=StatusCode.OK)


class NewHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_query_string_params('page')
    def get(self, page, connector):
        """Retrieve metadata for newest decks."""

        # Retrieve a page of deck's metadata.
        decks = connector.call_procedure('FETCH_DECKS', 'new' , page)

        for deck in decks:
            deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck["uuid"]))

        # Return search results to the user.
        return self.make_response(response=json.dumps(decks, default=serializer),
            status=StatusCode.OK)

class SearchHandler(BaseHandler):
    @authorize_request_and_create_db_connector
    @require_query_string_params('query', 'tags', 'page')
    def get(self, query, tags_json, page, connector):
        """Retrieve metadata for decks matching the search string."""

        tags = json.loads(tags_json)

        tags_string = ",".join(tags)

        decks = connector.call_procedure('SEARCH_DECKS', query, tags_string, len(tags), page)

        for deck in decks:
            deck['tags'] = map(lambda x: x['tag'], connector.call_procedure('GET_TAGS', deck["uuid"]))

        # Return search results to the user.
        return self.make_response(response=json.dumps(decks, default=serializer),
            status=StatusCode.OK)

routes = [
    ('/v1/discover/top', TopHandler),
    ('/v1/discover/new', NewHandler),
    ('/v1/discover/search', SearchHandler)
]

import json

from model.deck import Deck
from utils.database import DatabaseConnector
from utils.serializer import serializer


class Discover(object):
    def __init__(self, user_id, connector=None):
        self.user_id = user_id
        self.connector = connector or DatabaseConnector()

    def fetch(self, category, page=1):
        deck_uuids = self.connector.call_procedure('FETCH_DECK_UUIDS', category, page)
        results = []
        for deck_uuid in deck_uuids:
            results.append(Deck(deck_uuid['uuid'], connector=self.connector).get_metadata(self.user_id))

        return results

    def top(self, page=1):
        return self.fetch('top', page)

    def top_to_json(self, page=1):
        return json.dumps(self.top(page), default=serializer)

    def new(self, page=1):
        return self.fetch('new', page)

    def new_to_json(self, page=1):
        return json.dumps(self.new(page), default=serializer)

    def search(self, query, page=1):
        deck_uuids = self.connector.call_procedure('SEARCH_DECKS', query, page)
        results = []
        for deck_uuid in deck_uuids:
            results.append(Deck(deck_uuid['uuid'], connector=self.connector).get_metadata(self.user_id))

        return results

    def search_to_json(self, query, page=1):
        return json.dumps(self.search(query, page), default=serializer)

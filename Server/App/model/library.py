import json

from model.deck import Deck
from utils.database import DatabaseConnector
from utils.serializer import serializer


class Accession(object):
    """Constants specifying how a deck was added to the library."""
    PRIVATE = 'private'
    PUBLIC = 'public'
    SHARED = 'shared'


class Library(object):
    def __init__(self, user_id, connector=None):
        self.user_id = user_id
        self.connector = connector or DatabaseConnector()

    def to_json(self):
        deck_uuids = self.connector.call_procedure('FETCH_LIBRARY', self.user_id)

        deck_metadata = []
        for deck_uuid in deck_uuids:
            deck_metadata.append(Deck(deck_uuid['deck_id'], connector=self.connector).get_metadata(self.user_id))

        return json.dumps(deck_metadata, default=serializer)

    def add(self, deck_id, device, accession):
        self.connector.call_procedure_transactionally(
            'LIBRARY_ADD', self.user_id, deck_id, device, accession)

    def copy(self, deck, device):
        deck_json = deck.get_full_deck(self.user_id)
        new_deck = Deck.create(deck_json['name'], self.user_id, device, deck_json['tags'],
                               deck_json['cards'], connector=self.connector)
        return new_deck

    def remove(self, deck_id):
        self.connector.call_procedure_transactionally('LIBRARY_REMOVE', self.user_id, deck_id)

    def contains(self, deck_id):
        results = self.connector.query(
            'SELECT deck_id FROM Library WHERE deck_id=%s AND user_id=%s', deck_id, self.user_id)
        return len(results) == 1

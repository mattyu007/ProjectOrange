import json
import random
import string

from config import SecurityConfig
from model.card import Card
from utils.database import DatabaseConnector
from utils.identity import generate_uuid
from utils.serializer import serializer


class Deck(object):
    def __init__(self, uuid, connector=None):
        self.uuid = uuid
        self.connector = connector or DatabaseConnector()

    @staticmethod
    def create(name, user_id, device, tags, cards, connector):
        connector = connector or DatabaseConnector()
        deck_id = generate_uuid()
        try:
            connector.begin_transaction()
            connector.call_procedure('CREATE_DECK', deck_id, name, user_id, device, ','.join(tags))
            for index in xrange(len(cards)):
                Card.create(deck_id, cards[index]['front'], cards[index]['back'], index,
                            reposition=False, connector=connector)
            connector.end_transaction()

        except:
            connector.abort_transaction()
            raise

        return Deck(deck_id)

    @staticmethod
    def get_by_share_code(share_code, connector=None):
        if share_code is None:
            return None

        connector = connector or DatabaseConnector()
        results = connector.query('SELECT uuid FROM Deck WHERE share_code=%s', share_code)

        if len(results) != 1:
            return None
        return Deck(results[0]['uuid'])

    def set_name(self, name):
        self.connector.query_transactionally('UPDATE Deck SET name=%s WHERE uuid=%s', name, self.uuid)

    def set_public(self, public):
        self.connector.query_transactionally(
            'UPDATE Deck SET public=%s WHERE uuid=%s', public, self.uuid)

    def nullify_share_code(self):
        self.connector.call_procedure_transactionally('SET_SHARE_CODE', self.uuid, None)

    def set_tags(self, tags):
        self.connector.call_procedure_transactionally(
            'SET_DELIMITED_TAGS', self.uuid, ','.join(tags) if len(tags) > 0 else None)

    def update_deck_version(self):
        self.connector.call_procedure_transactionally('INCREMENT_DECK_VERSION', self.uuid)

    def update_user_version(self, user_id, device):
        self.connector.call_procedure_transactionally(
            'INCREMENT_USER_DATA_VERSION', user_id, self.uuid, device)

    def rate(self, user_id, rating):
        self.connector.begin_transaction()
        self.connector.call_procedure('UNRATE_DECK', user_id, self.uuid)
        self.connector.call_procedure('RATE_DECK', user_id, self.uuid, rating)
        self.connector.end_transaction()

    def get_share_code(self):
        result = self.connector.call_procedure('GET_SHARE_CODE', self.uuid)
        if len(result) != 1:
            return None

        if result[0]['share_code'] is not None:
            return result[0]['share_code']

        # Need to generate a share code.
        self.connector.begin_transaction()
        while True:
            share_code = ''.join(random.choice(string.ascii_uppercase + string.digits)
                                 for _ in range(SecurityConfig.SHARE_CODE_LENGTH))

            result = self.connector.call_procedure('SET_SHARE_CODE', self.uuid, share_code)
            if len(result) != 1:
                self.connector.abort_transaction()
                return None

            # Check if code was successfully set.
            if (result[0]['share_code'] is not None):
                break

        self.connector.end_transaction()
        return result[0]['share_code']

    def get_cards(self, user_id):
        return self.connector.call_procedure('FETCH_CARDS', user_id, self.uuid)

    def get_metadata(self, user_id):
        results = self.connector.call_procedure('FETCH_DECK', user_id, self.uuid)
        if len(results) != 1:
            return None
        deck = results[0]
        deck['accessible'] = self._is_accessible(deck, user_id)

        results = self.connector.call_procedure('GET_DELIMITED_TAGS', self.uuid)
        if len(results) != 1:
            return None
        tags = results[0]['tags_delimited']

        deck['tags'] = [] if tags is None else tags.split(',')
        return deck

    def _is_accessible(self, deck, user_id):
        if deck['accession'] == 'private':
            return True if user_id == deck['owner'] else False
        if deck['accession'] == 'shared':
            return True if (deck['public'] or deck['share_code'] is not None) else False
        if deck['accession'] == 'public':
            return True if deck['public'] else False
        return False

    def get_full_deck(self, user_id):
        deck = self.get_metadata(user_id)
        if deck is None:
            return None
        deck['cards'] = self.get_cards(user_id)
        return deck

    def metadata_to_json(self, user_id):
        deck = self.get_metadata(user_id)
        return json.dumps(deck, default=serializer, ensure_ascii=False)

    def full_deck_to_json(self, user_id):
        deck = self.get_full_deck(user_id)
        return json.dumps(deck, default=serializer, ensure_ascii=False)

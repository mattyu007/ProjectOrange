from utils.database import DatabaseConnector
from utils.identity import generate_uuid


class Card(object):
    def __init__(self, uuid, connector=None):
        self.uuid = uuid
        self.connector = connector or DatabaseConnector()

    @staticmethod
    def create(deck_id, front, back, position, reposition=True, connector=None):
        connector = connector or DatabaseConnector()
        uuid = generate_uuid()
        procedure_name = 'CREATE_CARD_AND_UPDATE_POSITIONS' if reposition else 'CREATE_CARD'

        connector.call_procedure_transactionally(procedure_name, uuid, deck_id, front, back, position)
        return Card(uuid, connector)

    def edit(self, deck_id, front, back, position):
        self.connector.call_procedure_transactionally(
            'EDIT_CARD', self.uuid, deck_id, front, back, position)

    def delete(self, deck_id):
        self.connector.call_procedure_transactionally(
            'DELETE_CARD_AND_UPDATE_POSITIONS', self.uuid, deck_id)

    def needs_review(self, needs_review, user_id):
        procedure_name = 'FLAG_CARD' if needs_review else 'UNFLAG_CARD'
        self.connector.call_procedure_transactionally(procedure_name, self.uuid, user_id)

    def get(self):
        results = self.connector.query('SELECT * FROM Card WHERE uuid=%s', self.uuid)
        if len(results) != 1:
            return None
        return results[0]

import json

from utils.database import DatabaseConnector
from utils.identity import generate_uuid, generate_access_token


class User(object):
    def __init__(self, uuid, connector=None):
        self.uuid = uuid
        self.connector = connector or DatabaseConnector()

    @staticmethod
    def create(fb_user_id, connector=None):
        connector = connector or DatabaseConnector()
        uuid = generate_uuid()
        access_token = generate_access_token()
        connector.call_procedure_transactionally('CREATE_USER', uuid, access_token, fb_user_id)
        return User(uuid, connector=connector)

    @staticmethod
    def get_by_facebook_id(fb_user_id, connector=None):
        connector = connector or DatabaseConnector()
        results = connector.query('SELECT uuid FROM User WHERE fb_user_id=%s', fb_user_id)
        if len(results) != 1:
            return None
        return User(results[0]['uuid'], connector=connector)

    def get(self):
        result = self.connector.call_procedure_transactionally('GET_USER', self.uuid)
        if len(result) != 1:
            return None
        return result[0]

    def to_json(self):
        return json.dumps(self.get())

    def set_name(self, name):
        self.connector.call_procedure_transactionally('SET_USER_NAME', self.uuid, name)

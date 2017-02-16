"""
Manage user name information.
"""

import json

from config import DBConfig, StatusCode
from utils.base_handler import BaseHandler
from utils.wrappers import authorize_request_and_create_db_connector, extract_user_id, \
    require_params


class UserHandler(BaseHandler):
    """Manage the user's name."""
    @authorize_request_and_create_db_connector
    @extract_user_id
    @require_params('name')
    def put(self, name, user_id, connector):
        """Update the user's name."""
        connector.call_procedure_transactionally('SET_USER_NAME', user_id, name)
        return self.make_response(status=StatusCode.OK)

    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector):
        """Retrieve the user's name."""
        result = connector.call_procedure_transactionally('GET_USER_NAME', user_id)
        return self.make_response(response=json.dumps(result[0]))


routes = [
    ('/v1/user', UserHandler)
]

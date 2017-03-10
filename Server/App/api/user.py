"""
Manage user name information.
"""

import json

from config import StatusCode
from model.user import User
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
        User(user_id, connector).set_name(name)
        return self.make_response(status=StatusCode.OK)

    @authorize_request_and_create_db_connector
    @extract_user_id
    def get(self, user_id, connector):
        """Retrieve the user's name."""
        user_name = User(user_id).get()['name']
        return self.make_response(response=json.dumps({'name': user_name}))


routes = [
    ('/v1/user', UserHandler)
]

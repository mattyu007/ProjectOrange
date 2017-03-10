"""
Handle requests to update authentication tokens and create users.
"""

import json
import logging

from config import StatusCode
from model.user import User
from utils.base_handler import BaseHandler
from utils.database import DatabaseConnector
from utils.facebook import request_facebook_token_validation, facebook_token_is_valid
from utils.wrappers import require_params


class AuthHandler(BaseHandler):
    """Manage account creation and updates."""

    @require_params('access_token', 'user_id')
    def post(self, access_token, user_id):
        """Validate a given access token and insert it into the User table."""

        # Ask Facebook to verify the token.
        response = request_facebook_token_validation(access_token)
        if not facebook_token_is_valid(response) or response['user_id'] != user_id:
            logging.info(
                'Received invalid access token update request from Facebook user ID {}'.format(user_id))
            return self.make_response(status=StatusCode.UNAUTHORIZED)

        # Check if the DB already has this user registered.
        connector = DatabaseConnector()
        user = User.get_by_facebook_id(user_id, connector=connector)

        # Return existing credentials.
        if user is not None:
            user_json = user.get()
            return self.make_response(response=json.dumps({
                'user-id': user_json['uuid'],
                'access-token': user_json['access_token']
            }))

        # Create a new user.
        user = User.create(user_id, connector=connector)
        logging.info('Created new user with ID {}'.format(user.uuid))

        # Return newly created credentials.
        user_json = user.get()
        return self.make_response(response=json.dumps({
            'user-id': user_json['uuid'],
            'access-token': user_json['access_token']
        }), status=StatusCode.CREATED)


routes = [
    ('/v1/auth', AuthHandler)
]

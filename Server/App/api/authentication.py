"""
Handle requests to update authentication tokens and create users.
"""

import json
import logging

from config import DBConfig, StatusCode
from utils.base_handler import BaseHandler
from utils.database import DatabaseConnector
from utils.facebook import request_facebook_token_validation, facebook_token_is_valid
from utils.identity import generate_access_token, generate_uuid
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
                'Received invalid access token update request from user ID {}'.format(user_id))
            return self.make_response(status=StatusCode.UNAUTHORIZED)

        # Check if the DB already has this user registered.
        connector = DatabaseConnector()
        result = connector.call_procedure('GET_CREDENTIALS_BY_FACEBOOK_ID', user_id)

        # Return existing credentials.
        if len(result) == 1:
            return self.make_response(response=json.dumps({
                'user-id': result['uuid'],
                'access-token': result['access_token']
            }))

        # Create a new user.
        cue_uuid = generate_uuid()
        cue_access_token = generate_access_token()
        connector.call_procedure_transactionally('CREATE_USER', cue_uuid, cue_access_token, user_id)
        logging.info('Updated access token for user ID {}'.format(user_id))

        # Return newly created credentials.
        return self.make_response(response=json.dumps({
            'user-id': cue_uuid,
            'access-token': cue_access_token
        }), status=StatusCode.CREATED)


routes = [
    ('/v1/auth', AuthHandler)
]

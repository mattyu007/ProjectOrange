"""
Convenience wrappers for handler methods.
"""

import json

from config import DBConfig, SecurityConfig, StatusCode
from utils.database import DatabaseConnector


def extract_user_id(func):
    """
    Extracts the user ID from the X-CUE-USER-ID header and passes it to the wrapped function.
    """
    def wrapper(*args, **kwargs):
        self = args[0]
        user_id = self.request.headers.get(SecurityConfig.USER_ID_HEADER)

        return func(self, user_id, *(list(args)[1:]), **kwargs)
    return wrapper


def authorize_request_and_create_db_connector(func):
    """
    Authorizes requests made by clients.
    This wrapper also passes the corresponding handler a new instance of a DB connector.
    """
    def wrapper(*args, **kwargs):
        self = args[0]
        access_token = self.request.headers.get(SecurityConfig.ACCESS_TOKEN_HEADER)
        user_id = self.request.headers.get(SecurityConfig.USER_ID_HEADER)

        if access_token is None or user_id is None:
            self.abort_transaction(StatusCode.UNAUTHORIZED)

        # Retrieve access token from DB
        connector = DatabaseConnector()
        result = connector.call_procedure_transactionally('GET_ACCESS_TOKEN', user_id)

        # Verify they are the same
        if len(result) != 1 or access_token != result[0]['access_token']:
            self.abort_transaction(StatusCode.UNAUTHORIZED)

        return func(self, connector, *(list(args)[1:]), **kwargs)
    return wrapper


def require_query_string_params(*params):
    """Extract parameters from a query string."""

    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            self = args[0]
            param_vals = []
            for param in params:
                if param not in self.request.args:
                    return self.make_response(
                        'Expected {} as a parameter'.format(param), StatusCode.BAD_REQUEST)
                param_vals.append(self.request.args[param])

            # Call wrapped function with extracted parameters
            return func(self, *(param_vals + list(args)[1:]), **kwargs)
        return wrapper
    return func_wrapper


def require_params(*params):
    """Extract parameters from a request payload."""

    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            self = args[0]
            param_vals = []
            payload = None
            try:
                payload = json.loads(self.request.data)
            except Exception:
                return self.make_response('Payload must be JSON', StatusCode.UNSUPPORTED_MEDIA_TYPE)

            # Extract parameters from the payload.
            for param in params:
                if param not in payload:
                    return self.make_response(
                        'Expected {} as a parameter'.format(param), StatusCode.BAD_REQUEST)
                param_vals.append(payload[param])

            # Call wrapped function with extracted parameters
            return func(self, *(param_vals + list(args)[1:]), **kwargs)
        return wrapper
    return func_wrapper



def optional_params(*params):
    """
    Extract optional parameters from a request payload.
    Parameters that aren't supplied will have a value of None.
    """

    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            self = args[0]
            param_vals = []
            payload = None
            try:
                payload = json.loads(self.request.data)
            except:
                return self.make_response('Payload must be JSON', StatusCode.UNSUPPORTED_MEDIA_TYPE)

            # Extract parameters from the payload.
            for param in params:
                if param in payload:
                    param_vals.append(payload[param])
                else:
                    param_vals.append(None)

            # Call wrapped function with extracted parameters
            return func(self, *(param_vals + list(args)[1:]), **kwargs)
        return wrapper
    return func_wrapper

"""
App-wide configuration.
"""


class StatusCode(object):
    """HTTP Status Codes."""
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    CONFLICT = 409
    UNSUPPORTED_MEDIA_TYPE = 415
    INTERNAL_SERVER_ERROR = 500


class DBConfig(object):
    USERNAME = 'root'
    PASSWORD = 'root'
    HOST = 'localhost'
    DB_NAME = 'Cue'
    SCHEMA_PATH = 'SQL/schema.sql'
    PROCEDURE_PATH = 'SQL/procedures.sql'


class ServerConfig(object):
    PUBLIC_URL = 'cue.ngrok.io'
    PROTOCOL = 'http'
    AUTH_ROUTE = '/api/v1/auth'


class FacebookConfig(object):
    APP_NAME = 'Cue'
    APP_ID = '1655143831455954'
    APP_SECRET = '?????'  # Populate in prod

    VERIFY_ACCESS_TOKEN_URL = ('https://graph.facebook.com/debug_token?' +
        'input_token={access_token}&access_token={app_token}')
    APP_ACCESS_TOKEN_URL = ('https://graph.facebook.com/oauth/access_token?' +
        'client_id={app_id}&client_secret={app_secret}&grant_type=client_credentials')


class SecurityConfig(object):
    ACCESS_TOKEN_HEADER = 'X-CUE-ACCESS-TOKEN'
    USER_ID_HEADER = 'X-CUE-USER-ID'
    ACCESS_TOKEN_RAW_BYTES = 120

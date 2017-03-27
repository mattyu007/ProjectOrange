"""
App-wide configuration.
"""

import os


class StatusCode(object):
    """HTTP Status Codes."""
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    METHOD_NOT_ALLOWED = 405
    CONFLICT = 409
    UNSUPPORTED_MEDIA_TYPE = 415
    INTERNAL_SERVER_ERROR = 500


class DBConfig(object):
    USERNAME = os.getenv('DB_USERNAME', 'root')
    PASSWORD = os.getenv('DB_PASSWORD', 'root')
    HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = 'Cue'
    CHARSET = 'utf8mb4'
    SCHEMA_PATH = 'SQL/schema.sql'
    PROCEDURE_PATH = 'SQL/procedures.sql'
    TESTDATA_DIRECTORY = 'SQL/Testdata'
    MIGRATION_DIRECTORY = 'SQL/Migrations'


class FacebookConfig(object):
    APP_NAME = os.getenv('APP_NAME', '????')
    APP_ID = os.getenv('APP_ID', '????')
    APP_SECRET = os.getenv('APP_SECRET', '????')

    VERIFY_ACCESS_TOKEN_URL = ('https://graph.facebook.com/debug_token?' +
                               'input_token={access_token}&access_token={app_token}')


class SecurityConfig(object):
    ACCESS_TOKEN_HEADER = 'X-CUE-ACCESS-TOKEN'
    USER_ID_HEADER = 'X-CUE-USER-ID'
    ACCESS_TOKEN_RAW_BYTES = 120
    SHARE_CODE_LENGTH = 8

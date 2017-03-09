"""
Utilities for using Facebook authorization.
See https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow for details.
"""

import json
from urllib2 import urlopen

from config import FacebookConfig


def request_facebook_token_validation(access_token):
    """
    Verify that an access token is valid.
    """
    response = urlopen(FacebookConfig.VERIFY_ACCESS_TOKEN_URL.format(
        access_token=access_token,
        app_token='{}|{}'.format(FacebookConfig.APP_ID, FacebookConfig.APP_SECRET)
    ))
    data = response.read()
    return json.loads(data).get('data')


def facebook_token_is_valid(token_validation_response):
    """
    Verify that a token is both valid and intended to be used with our app.
    """
    if not isinstance(token_validation_response, dict):
        return False

    return (token_validation_response.get('app_id') == FacebookConfig.APP_ID and
            token_validation_response.get('application') == FacebookConfig.APP_NAME and
            token_validation_response.get('is_valid') is True and
            token_validation_response.get('user_id') is not None)

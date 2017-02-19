"""
User identity and access token generation.
"""

from base64 import b64encode
from os import urandom
from uuid import uuid4

from config import SecurityConfig


def generate_access_token():
    """Generate a new access token."""
    return b64encode(urandom(SecurityConfig.ACCESS_TOKEN_RAW_BYTES))


def generate_uuid():
    """Generate a random UUID."""
    return str(uuid4())

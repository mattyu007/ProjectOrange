"""
Provide a default serializer for non-serializable objects.
"""

from datetime import datetime


def serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise NotImplementedError

from model.deck import Deck
from model.library import Library


class DeckPolicy(object):
    @staticmethod
    def can_view(deck_id, user_id, share_code=None, connector=None):
        deck = Deck(deck_id, connector)
        metadata = deck.get_metadata(user_id)
        if metadata is None:
            return None

        if (
            not metadata['public'] and
            (user_id is None or metadata['owner'] != user_id) and
            (share_code is None or metadata['share_code'] != share_code)
        ):
            return None
        return deck

    @staticmethod
    def owned_by(deck_id, user_id, connector=None):
        return DeckPolicy.can_edit(deck_id, user_id, connector)

    @staticmethod
    def can_edit(deck_id, user_id, connector=None):
        deck = Deck(deck_id, connector)
        metadata = deck.get_metadata(user_id)
        if metadata is None:
            return None

        if metadata['owner'] != user_id:
            return None
        return deck

    @staticmethod
    def in_library(deck_id, user_id, connector=None):
        library = Library(user_id, connector=connector)
        if library.contains(deck_id):
            return Deck(deck_id, connector=connector)
        return None

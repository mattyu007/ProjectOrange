from model.card import Card


class CardPolicy(object):
    @staticmethod
    def belongs_to(uuid, deck_id, connector=None):
        card = Card(uuid, connector)
        if card.get()['deck_id'] != deck_id:
            return None
        return card

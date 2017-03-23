import random
import string
import sys

from utils.database import DatabaseConnector

"""
Insert 100 decks x 500 cards into the database so that we can test our NFP claim.
"""

NUM_CARDS = 500
NUM_DECKS = 100
USER_ID = '3e7a9be3-1429-401f-878a-7acce8e9c249'


def get_random_string(size):
    return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in xrange(size))


def generate_deck(uuid, user_id):
    return (
        'INSERT INTO `Deck` ' +
        '(uuid, created, last_update, name, owner, rating, public, tags_delimited, deleted, version, share_code) ' +
        'VALUES ' +
        "('{uuid}', '2017-03-01 20:01:14', '2017-03-01 20:01:14', '{name}', '{user_id}', 0, 0, NULL, 0, 0, NULL)"
    ).format(uuid=uuid, name=get_random_string(25), user_id=user_id)


def generate_card(uuid, deck_id, position):
    return (
        'INSERT INTO `Card` ' +
        '(uuid, deck_id, front, back, position) '
        'VALUES ' +
        "('{uuid}', '{deck_id}', '{front}', '{back}', '{position}')"
    ).format(
        uuid=uuid,
        deck_id=deck_id,
        position=position,
        front=get_random_string(250),
        back=get_random_string(250)
    )


def generate_lib(deck_id, user_id):
    return (
        'INSERT INTO `Library` ' +
        '(user_id, deck_id, version, last_update_device, accession) ' +
        'VALUES ' +
        "('{user_id}', '{deck_id}', 0, 'SCRIPT', 'private' )"
    ).format(user_id=user_id, deck_id=deck_id)


def generate_entry(uuid, user_id):
    connector = DatabaseConnector()
    connector.query_transactionally(generate_deck(uuid, user_id))
    for i in xrange(NUM_CARDS):
        connector.query_transactionally(generate_card(str(uuid) + '-' + str(i), uuid, i))
    connector.query_transactionally(generate_lib(uuid, user_id))


if __name__ == '__main__':
    for i in xrange(NUM_DECKS):
        generate_entry(i, USER_ID)
        sys.stdout.write('\r{}%'.format(i+1))
        sys.stdout.flush()
    sys.stdout.write('\n')
    sys.stdout.flush()

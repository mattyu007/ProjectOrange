"""
Script that generates a huge SQL file to test our NFP claim on.

REPLACE THE USER_ID BELOW WITH YOUR CUE USER ID SO YOU CAN TEST IT (or the test user's ID).

This script will generate 100 decks x 500 cards and 100 library entries.
This script will dump everything to standard out so direct it to a file.

TO PUT THE DATA INTO THE DB:
    python generate_nfp_testdata.py > somefile.sql
    mysql -uroot -p < somefile.sql

FAQ:
    Q: Is this the ugliest script I have ever seen?
    A: Yes, get over it.
"""


import random
import string


USER_ID = '3e7a9be3-1429-401f-878a-7acce8e9c249'


def get_random_string(size):
    return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in xrange(size))


def generate_deck(uuid):
    return (
"""(
    '{uuid}',
    '2017-03-01 20:01:14',
    '2017-03-01 20:01:14',
    '{name}',
    '{user_id}',
    0,
    0,
    NULL,
    0,
    0,
    NULL
)""".format(uuid=uuid, name=get_random_string(25), user_id=USER_ID))


def generate_card(uuid, deck_id, position):
   return (
"""(
    '{uuid}',
    '{deck_id}',
    '{front}',
    '{back}',
    '{position}'
)""".format(uuid=uuid, deck_id=deck_id, position=position,
            front=get_random_string(250),
            back=get_random_string(250)))


def generate_lib(deck_id):
    return(
"""(
    '{user_id}',
    '{deck_id}',
    0,
    'SCRIPT',
    'private'
)""".format(user_id=USER_ID, deck_id=deck_id))


print('USE Cue;\n')
print('SET GLOBAL wait_timeout=600;\n')

print('INSERT INTO `Deck`')
print('    (uuid, created, last_update, name, owner, rating, public, tags_delimited, deleted, version, share_code)')
print('VALUES')

for i in xrange(100):
    deck = generate_deck(i)
    if i != 99:
        deck += ','
    else:
        deck += ';'
    print(deck)

print('\n')
print('INSERT INTO `Card`')
print('    (uuid, deck_id, front, back, position)')
print('VALUES')

for i in xrange(100):
    for j in xrange(500):
        card = generate_card(str(i) + '-' + str(j), i, j)
        if i == 99 and j == 499:
            card += ';'
        else:
            card += ','
        print(card)

print('\n')
print('INSERT INTO `Library`')
print('    (user_id, deck_id, version, last_update_device, accession)')
print('VALUES')

for i in xrange(100):
    lib = generate_lib(i)
    if i != 99:
        lib += ','
    else:
        lib += ';'
    print(lib)

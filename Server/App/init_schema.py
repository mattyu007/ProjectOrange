import logging
import subprocess

import MySQLdb

from config import DBConfig

"""
Simple script that initializes the DB with the appropriate schema.
"""

choice = raw_input('This will destroy all data in the existing database, proceed? (y/n): ')
if choice.lower() != 'y':
    print('Aborting operation.')
    exit(0)


db = MySQLdb.connect(host=DBConfig.HOST, user=DBConfig.USERNAME, passwd=DBConfig.PASSWORD)

if not db:
    logging.error('Could not connect to DB')
    exit(1)

try:
    # Drop the database if it exists.
    # This will log a warning if the DB didn't already exist.
    cursor = db.cursor()
    cursor.execute('DROP DATABASE IF EXISTS Cue')
    cursor.close()

    # Read in schema file to DB.
    mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)
    with open(DBConfig.SCHEMA_PATH, 'r') as fd:
        subprocess.check_call(mysql_cmd.split(), stdin=fd)
except:
    logging.error('Could not initialize DB schema', exc_info=True)
    exit(1)
finally:
    db.close()

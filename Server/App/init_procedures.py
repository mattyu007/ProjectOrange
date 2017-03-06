import logging
import subprocess

import MySQLdb

from config import DBConfig

"""
Simple script that initializes the DB with stored procedures.
"""


db = MySQLdb.connect(host=DBConfig.HOST, user=DBConfig.USERNAME, passwd=DBConfig.PASSWORD)

if not db:
    logging.error('Could not connect to DB')
    exit(1)

try:
    # Delete stored procedures in the Cue database.
    cursor = db.cursor()
    cursor.execute('DELETE FROM mysql.proc WHERE db LIKE \'{}\' AND type=\'PROCEDURE\''.format(DBConfig.DB_NAME))
    cursor.close()

    # Create stored procedures with SQL script.
    mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)
    with open(DBConfig.PROCEDURE_PATH, 'r') as fd:
        subprocess.check_call(mysql_cmd.split(), stdin=fd)
except:
    logging.error('Could not create stored procedures', exc_info=True)
    exit(1)
finally:
    db.close()

import logging
import subprocess

from config import DBConfig


"""
Simple script that inserts test data into the database.
"""


mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)

try:
    for file_name in DBConfig.TEST_DATA_FILES:
        with open(file_name, 'r') as fd:
            subprocess.check_call(mysql_cmd.split(), stdin=fd)
except:
    logging.error('Could not insert test data into the DB', exc_info=True)
    exit(1)

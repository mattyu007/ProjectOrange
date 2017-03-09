import logging
import subprocess

from config import DBConfig

"""
Simple script that initializes the DB with stored procedures.
"""


mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)

try:
    # Create stored procedures with SQL script.
    with open(DBConfig.PROCEDURE_PATH, 'r') as fd:
        subprocess.check_call(mysql_cmd.split(), stdin=fd)
except:
    logging.error('Could not create stored procedures', exc_info=True)
    exit(1)

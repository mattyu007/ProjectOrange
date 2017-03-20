import logging
import os
import subprocess

from config import DBConfig

"""
Simple script that inserts test data into the database.
"""


mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)

try:
    # Collect a list of test data files in order.
    test_files = map(
        lambda x: os.path.join(DBConfig.TESTDATA_DIRECTORY, x),
        sorted(os.listdir(DBConfig.TESTDATA_DIRECTORY))
    )
    files = ' '.join(test_files)
    mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)

    # Read the files into the DB.
    ps = subprocess.Popen(('cat {}'.format(files)).split(), stdout=subprocess.PIPE)
    subprocess.check_call(mysql_cmd.split(), stdin=ps.stdout)
    ps.wait()

except:
    logging.error('Could not insert test data into the DB', exc_info=True)
    exit(1)

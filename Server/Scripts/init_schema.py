import logging
import os
import subprocess

from config import DBConfig

"""
Simple script that initializes the DB with the appropriate schema.
This script also runs all the DB migrations in order.
"""


choice = raw_input('This will destroy all data in the existing database, proceed? (y/n): ')
if choice.lower() != 'y':
    logging.error('Aborting operation.')
    exit(0)

try:
    # Collect a list of migration files in order.
    migration_files = map(
        lambda x: os.path.join(DBConfig.MIGRATION_DIRECTORY, x),
        sorted(os.listdir(DBConfig.MIGRATION_DIRECTORY))
    )
    files = ' '.join([DBConfig.SCHEMA_PATH] + migration_files)
    mysql_cmd = 'mysql -u{} -p'.format(DBConfig.USERNAME)

    # Read the files into the DB.
    ps = subprocess.Popen(('cat {}'.format(files)).split(), stdout=subprocess.PIPE)
    subprocess.check_call(mysql_cmd.split(), stdin=ps.stdout)
    ps.wait()

except:
    logging.error('Could not initialize DB schema', exc_info=True)
    exit(1)

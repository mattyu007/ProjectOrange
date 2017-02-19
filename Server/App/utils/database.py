"""
All things related to the database.
Includes convience functions and common SQL statements.
"""

import MySQLdb
import logging

from config import DBConfig


class DatabaseConnector(object):
    """Connector object for the DB."""

    def __init__(self, host=DBConfig.HOST, user=DBConfig.USERNAME, password=DBConfig.PASSWORD,
            db=DBConfig.DB_NAME):
        """Initialize with parameters for a DB connection."""
        super(DatabaseConnector, self).__init__()
        self.connector = MySQLdb.connect(host=host, user=user, passwd=password, db=db)

    def __del__(self):
        """Close the connector."""
        self.connector.close()

    def begin_transaction(self):
        """Start a transaction by disabling autocommit."""
        self.connector.autocommit(False)

    def end_transaction(self):
        """Commit and then reset the autocommit to True."""
        self.connector.commit()
        self.connector.autocommit(True)

    def abort_transaction(self):
        """Abort the transaction and reset the autocommit to True."""
        self.connector.rollback()
        self.connector.autocommit(True)

    def call_procedure_transactionally(self, proc_name, *params):
        """Call a stored procedure in the database and JSON-ify the results."""
        self.begin_transaction()
        result = self.call_procedure(proc_name, *params)
        self.end_transaction()
        return result

    def call_procedure(self, proc_name, *params):
        """Call a stored procedure in the database and JSON-ify the results."""
        cursor = self.connector.cursor()
        cursor.callproc(proc_name, params)

        if cursor.description is None:
            cursor.close()
            return

        columns = [c[0] for c in cursor.description]
        results = []
        for row in cursor:
            results.append(dict(zip(columns, row)))

        cursor.close()
        return results

    def query(self, query, *params):
        """Execute a query and JSON-ify the results."""
        cursor = self.connector.cursor()
        cursor.execute(query, params)

        if cursor.description is None:
            cursor.close()
            return

        columns = [c[0] for c in cursor.description]
        results = []
        for row in cursor:
            results.append(dict(zip(columns, row)))

        cursor.close()
        return results

    def query_transactionally(self, query, *params):
        self.begin_transaction()
        results = self.query(query, *params)
        self.end_transaction()
        return results

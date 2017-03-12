# Cue Server
Instructions for getting the server up and running.
The `system` target is currently written for Debian/Ubuntu systems.
On some systems, you may need to upgrade mysql-server to version 5.6 (or greater).

**Note:** When setting up MySQL, use 'root' for the username and password.

## Getting Up and Running
To install all dependencies and start the server, use the `everything` target, i.e. run:
```
make everything
```

## Make Targets
This section describes the targets in the `Makefile`
- `all`: the default target, invokes the run target
- `everything`: runs all targets in order
- `system`: install system dependencies (e.g. MySQL, Python)
- `venv`: create a virtual environment for python dependencies
- `depends`: install python dependencies to the virtual environment
- `schema`: run a script that initializes the database schema
- `procedures`: run a script that creates the stored procedures in the database
- `testdata`: run `schema` and `procedures`, then populate the DB with some test data
- `migration`: create a new DB migration file
- `lint`: run a linter that checks for syntax errors
- `run`: starts the server

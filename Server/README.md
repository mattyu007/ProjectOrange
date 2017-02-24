# Cue Server
Instructions for getting the server up and running.
The `system` target is currently written for Debian/Ubuntu systems.

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
- `init`: run a script that initializes the database
- `run`: starts the server

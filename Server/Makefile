export PYTHONPATH := $(shell pwd)
VENV = $(shell pwd)/venv
VPY = $(VENV)/bin/python
VPIP = $(VENV)/bin/pip


all: run

everything: system venv depends init run

depends:
	$(VPIP) install -r requirements.txt -q

run:
	$(VPY) App/server.py

init:
	$(VPY) App/initdb.py

venv:
	python -m virtualenv $(VENV)

# Only works on debian/ubuntu
system:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev
	pip install --user virtualenv

.PHONY: depends run init system

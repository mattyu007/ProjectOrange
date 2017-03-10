export PYTHONPATH := $(shell pwd)
VENV = $(shell pwd)/venv
VPY = $(VENV)/bin/python
VPIP = $(VENV)/bin/pip


all: run

everything: system venv depends schema procedures run

depends:
	$(VPIP) install -r requirements.txt -q

run:
	$(VPY) App/server.py

schema:
	$(VPY) App/init_schema.py

procedures:
	$(VPY) App/init_procedures.py

testdata: schema procedures
	$(VPY) App/init_test_data.py

venv:
	python -m virtualenv $(VENV)

lint:
	$(VPY) -m flake8 . --exclude=venv --max-line-length=120

migration:
	cp SQL/migration_template.sql SQL/Migrations/`$(VPY) -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d_%H-%M'))"`.sql

# Only works on debian/ubuntu
system:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev
	pip install --user virtualenv

.PHONY: depends run schema procedures system venv everything all

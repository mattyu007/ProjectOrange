import glob
import os
from importlib import import_module

import flask

app = flask.Flask(__name__)

# Collect all modules from api directory
modules = ['api.' + os.path.basename(f)[:-3]
           for f in glob.glob(os.path.join(os.path.dirname(__file__), 'api/*.py'))]

# Register module routes with flask
for module in modules:
    if module.endswith('__init__'):
        continue
    module_name = module.split('.')[-1]

    # Register GET, POST, PUT, DELETE handlers
    for route in import_module(module).routes:
        handler = route[1]()
        app.add_url_rule('/api' + route[0], route[1].__name__ + '_post', view_func=handler.post, methods=['POST'])
        app.add_url_rule('/api' + route[0], route[1].__name__ + '_get', view_func=handler.get, methods=['GET'])
        app.add_url_rule('/api' + route[0], route[1].__name__ + '_put', view_func=handler.put, methods=['PUT'])
        app.add_url_rule('/api' + route[0], route[1].__name__ + '_delete', view_func=handler.delete, methods=['DELETE'])


if __name__ == '__main__':
    app.run()

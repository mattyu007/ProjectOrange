import flask

from config import StatusCode


class BaseHandler(object):
    request = flask.request

    def post(self):
        self.abort(StatusCode.NOT_FOUND)

    def get(self):
        self.abort(StatusCode.NOT_FOUND)

    def put(self):
        self.abort(StatusCode.NOT_FOUND)

    def delete(self):
        self.abort(StatusCode.NOT_FOUND)

    def render_template(self, *args):
        return flask.render_template(*args)

    def abort(self, code):
        flask.abort(code)

    def make_response(self, response='', status=StatusCode.OK, headers={}):
        return flask.make_response(response, status, headers)

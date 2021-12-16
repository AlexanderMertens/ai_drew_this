from flask import Flask


def create_app():
    from . import views

    app = Flask(__name__)
    views.init_app(app)
    return app

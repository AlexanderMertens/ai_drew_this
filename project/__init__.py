from flask import Flask


def create_app() -> Flask:
    """Creates Flask app, initializes it and returns it.

    Returns:
        Flask: Initialized and configured Flask app.
    """
    from . import views

    app = Flask(__name__)
    views.init_app(app)
    return app

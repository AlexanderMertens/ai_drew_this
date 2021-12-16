from flask import Flask


def create_app():
    from .views.home import home_bp

    app = Flask(__name__)
    app.register_blueprint(home_bp)
    return app

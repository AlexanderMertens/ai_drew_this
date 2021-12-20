from flask import Flask

"""Creates Flask app, initializes it and returns it.

Returns:
    Flask: Initialized and configured Flask app.
"""
from . import views, controllers

app = Flask(__name__)
views.init_app(app)
controllers.init_app(app)

from flask import Blueprint
from flask.templating import render_template

home_bp = Blueprint("home", __name__)


@home_bp.route("/", methods=["GET"])
def home() -> str:
    """Renders index.html.

    Returns:
        str: The rendered template.
    """
    return render_template("index.html")


from flask import Blueprint
from flask import Response
from flask import send_file
from flask.templating import render_template
import numpy as np

from project.services import image_service

home_bp = Blueprint("home", __name__)


@home_bp.route("/", methods=["GET"])
def home() -> str:
    """Renders index.html.

    Returns:
        str: The rendered template.
    """
    return render_template("index.html")


@home_bp.route("/images/fake.png", methods=["GET"])
def image() -> Response:
    data = image_service.generate_quality_image_byte(quality=0.6)
    return send_file(data, mimetype="image/PNG")

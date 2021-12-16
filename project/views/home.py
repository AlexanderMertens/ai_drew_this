from flask import Blueprint
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


@home_bp.route("/test", methods=["GET"])
def image() -> str:
    data = image_service.generate_quality_image(quality=0.5)
    return np.array2string(data)

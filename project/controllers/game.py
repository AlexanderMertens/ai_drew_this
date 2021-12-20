import json

from flask import Blueprint
from flask import Response
from flask import send_file

from project.services import game, image_service

game_bp = Blueprint("game", __name__)


@game_bp.route("/images/fake.png", methods=["GET"])
def image_fake() -> Response:
    data = image_service.generate_quality_image_byte(quality=0.45)
    return send_file(data, mimetype="image/PNG")


@game_bp.route("/start-game", methods=["GET"])
def start_game() -> Response:
    game_plan = game.create_game()
    return Response(json.dumps(game_plan), mimetype="application/json")

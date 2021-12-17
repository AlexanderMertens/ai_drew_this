from config import config
from .generate_images import ImageService
from .game import Game

image_service = ImageService("butterfly")
game = Game(config["game"]["rounds"])


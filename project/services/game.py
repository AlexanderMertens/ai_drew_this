import os
import random
from datetime import datetime

from config import config
from flask import url_for


class Game:
    """Class that generates JSON object that directs the game in frontend.
    """

    def __init__(self, rounds: int) -> None:
        self.rounds = rounds

    def create_game(self) -> list[dict[bool, str]]:
        # Generate random number close half number rounds for number of real images.
        # This ensure number of real images is close to number of fake images.
        num_reals = random.randint((self.rounds // 2) - 2, (self.rounds // 2) + 2)
        num_fakes = self.rounds - num_reals

        real_images_src = random.sample(list_real_images(), num_reals)
        timestamp = int(datetime.now().strftime("%f"))
        fake_images_src = [
            get_fake_image_src(timestamp + n) for n in range(0, num_fakes)
        ]

        real_images = [{"isReal": True, "src": src} for src in real_images_src]
        fake_images = [{"isReal": False, "src": src} for src in fake_images_src]
        shuffled_images = real_images + fake_images
        random.shuffle(shuffled_images)
        return shuffled_images


def get_fake_image_src(num: int) -> str:
    """Returns src string for AI generated image. 

    Args:
        num (int): Parameter to ensure the image isn't in cache.

    Returns:
        str: Source for an AI generated image.
    """
    src = url_for("game.image_fake")
    return "{src}?t={num}".format(src=src, num=num)


def list_real_images() -> list[str]:
    """
    Returns:
        list[str]: list of all files in the folder containing drawings by real people.
    """
    directory_path = config["images"]["real_project_path"]
    url_path = config["images"]["real_url_path"]
    return [os.path.join(url_path, file) for file in os.listdir(directory_path)]


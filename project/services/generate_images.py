import numpy as np

from tensorflow.python.keras.models import load_model
from tensorflow.python.keras.models import Model

from config import config


class ImageService:
    def __init__(self, model_name: str) -> None:
        self.generator: Model = load_generator(model_name)
        self.discriminator: Model = load_discriminator(model_name)

    def generate_images(self, num_samples=10) -> np.array:
        """Generates an array of images generated using the provided generator model.
    
        Args:
            num_samples (int, optional): Amount of images to generate. Defaults to 10.
    
        Returns:
            np.array: Data of the generated images.
        """
        # Generate latent vector
        noise = np.random.normal(0, 1, (num_samples, config["dimensions"]["latent"]))
        # Outputs images with pixels in [-1, 1]
        images = np.array(self.generator(noise))
        return images

    def filter_images(self, images: np.ndarray, quality: float) -> np.ndarray:
        """Filters given images using the discriminator.

        Args:
            images (np.ndarray): Images to be filtered.
            quality (float): Only images with probability above quality are returned.

        Returns:
            np.ndarray: Images with a certain probability to be genuine, according to the discriminator.
        """
        # Probabilities the images are real according to discriminator.
        # i.e. quality of the image.
        probs = np.array(self.discriminator(images))
        # Filter any images of too low a quality
        filter = [probability[0] > quality for probability in probs]
        return images[filter]

    def generate_quality_images(
        self, num_samples: int, quality: float = 0.5
    ) -> np.ndarray:
        """Generate only images of appropriate quality.
    
        Args:
            generator (Model): Generator model that generators images.
            discriminator (Model): Discriminator model that judges images quality.
            num_samples (int): Number of samples to be generated.
            quality (float): Float between 0.0 and 1.0 representing quality of the images. Defaults to 0.5
    
        Returns:
            np.array: Array containing images.
        """
        quality_images = self.filter_images(self.generate_images(10), quality=quality)

        while quality_images.shape[0] < num_samples:
            new_images = self.filter_images(self.generate_images(100), quality=quality)
            quality_images = np.concatenate((quality_images, new_images))

        return quality_images[:num_samples]

    def generate_quality_image(self, quality: float = 0.5) -> np.ndarray:
        """Generate single image of appropriate quality

        Args:
            quality (float, optional): Float between 0.0 and 1.0 representing quality of the image. Defaults to 0.5.

        Returns:
            np.ndarray: Array containing data of single image.
        """
        return self.generate_quality_images(1, quality=quality)[0]


def load_generator(model_name: str) -> Model:
    return load_model("{}/generator".format(config["models"][model_name]))


def load_discriminator(model_name: str) -> Model:
    return load_model("{}/discriminator".format(config["models"][model_name]))


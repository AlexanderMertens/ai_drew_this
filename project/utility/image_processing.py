import numpy as np


def image_float_to_int(images: np.ndarray) -> np.ndarray:
    """Converts image data that consists of floats to integers. 
    Reshapes image data in appropriate shape for saving.

    Args:
        images (np.array): The images to be converted.

    Returns:
        np.array: Converted images.
    """
    # Convert pixels to integers 0 to 255
    images = (images * 127.5 + 127.5).astype(np.uint8)
    # Reshape to array of 2d arrays
    images = images.reshape((images.shape[0:3]))
    return images

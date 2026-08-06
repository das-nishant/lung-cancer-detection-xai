import io
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms

# ImageNet normalization standard parameters
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

transform_pipeline = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])

def process_uploaded_image(file_bytes: bytes):
    """
    Reads image bytes, validates format, converts to RGB PIL Image, numpy array, and PyTorch tensor.
    Returns (pil_img, img_np_224, tensor)
    Raises ValueError if image format is invalid or corrupted.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid or unsupported image file. Details: {str(e)}")
    
    # Save original size resized to 224x224 for display consistency
    pil_resized = image.resize((224, 224), Image.Resampling.BILINEAR)
    img_np_224 = np.array(pil_resized)
    
    tensor = transform_pipeline(image).unsqueeze(0) # Shape: (1, 3, 224, 224)
    return image, img_np_224, tensor


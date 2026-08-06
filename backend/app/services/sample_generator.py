import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_synthetic_ct_scan(scan_type: str, filepath: str):
    """
    Creates a realistic synthetic axial CT scan image of the thorax (lungs, chest wall, backbone, nodules/lesions).
    scan_type: 'normal', 'benign', or 'malignant'
    """
    size = (512, 512)
    img = Image.new("L", size, color=10) # Dark background
    draw = ImageDraw.Draw(img)
    
    # Outer thorax contour (chest wall)
    draw.ellipse([(40, 60), (472, 452)], fill=70, outline=180, width=8)
    # Vertebral column / spinal bone back highlight
    draw.ellipse([(230, 420), (282, 465)], fill=210)
    draw.ellipse([(240, 240), (272, 280)], fill=150) # Mediastinum / Heart
    
    # Left and Right Lung cavities (dark low-density regions)
    draw.ellipse([(80, 100), (230, 410)], fill=25, outline=120, width=3) # Right lung
    draw.ellipse([(282, 100), (432, 410)], fill=25, outline=120, width=3) # Left lung
    
    # Pulmonary vascular markings (fine bronchial tree branches)
    draw.line([(150, 250), (120, 200)], fill=90, width=2)
    draw.line([(150, 250), (130, 310)], fill=90, width=2)
    draw.line([(350, 250), (380, 190)], fill=90, width=2)
    draw.line([(350, 250), (370, 320)], fill=90, width=2)

    if scan_type == "benign":
        # Well-circumscribed smooth circular nodule in right upper lobe
        draw.ellipse([(140, 170), (175, 205)], fill=220, outline=240, width=2)
    elif scan_type == "malignant":
        # Spiculated, irregular dense mass with spiculated margins in left peripheral pulmonary field
        draw.polygon([(340, 180), (375, 160), (395, 190), (380, 225), (345, 215), (330, 195)], fill=240)
        # Add internal irregular density highlights
        draw.ellipse([(350, 175), (380, 205)], fill=255)
        draw.line([(340, 180), (320, 170)], fill=210, width=2) # Spiculation ray
        draw.line([(395, 190), (415, 195)], fill=210, width=2) # Spiculation ray

    # Apply Gaussian blur for soft slice appearance
    blurred = img.filter(ImageFilter.GaussianBlur(radius=1.5))
    
    # Add subtle Gaussian noise to mimic CT attenuation noise
    img_np = np.array(blurred, dtype=np.float32)
    noise = np.random.normal(0, 4.0, size).astype(np.float32)
    noisy_img = np.clip(img_np + noise, 0, 255).astype(np.uint8)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    Image.fromarray(noisy_img).convert("RGB").save(filepath)
    return filepath

def ensure_sample_scans(samples_dir: str):
    os.makedirs(samples_dir, exist_ok=True)
    samples = [
        {"id": "normal_sample", "name": "Normal Lung Scan (Healthy)", "type": "normal", "filename": "sample_normal.png"},
        {"id": "benign_sample", "name": "Benign Pulmonary Nodule", "type": "benign", "filename": "sample_benign.png"},
        {"id": "malignant_sample", "name": "Malignant Lung Lesion (Spiculated)", "type": "malignant", "filename": "sample_malignant.png"}
    ]
    
    for s in samples:
        filepath = os.path.join(samples_dir, s["filename"])
        if not os.path.exists(filepath):
            create_synthetic_ct_scan(s["type"], filepath)
            
    return samples

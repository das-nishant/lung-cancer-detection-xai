from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import uuid
from PIL import Image
import torch
import numpy as np

from app.preprocessing.image import process_uploaded_image
from app.ai.model import get_model, predict_ct_scan
from app.explainability.gradcam import generate_gradcam_outputs
from app.database.db import save_prediction

router = APIRouter()

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../uploads"))
ORIGINAL_DIR = os.path.join(UPLOADS_DIR, "original")
HEATMAP_DIR = os.path.join(UPLOADS_DIR, "heatmaps")
OVERLAY_DIR = os.path.join(UPLOADS_DIR, "overlays")
SAMPLES_DIR = os.path.join(UPLOADS_DIR, "samples")

os.makedirs(ORIGINAL_DIR, exist_ok=True)
os.makedirs(HEATMAP_DIR, exist_ok=True)
os.makedirs(OVERLAY_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

def generate_clinical_notes(prediction: str, confidence: float, roi_stats: dict):
    area = roi_stats.get("high_activation_area_pct", 0)
    intensity = roi_stats.get("peak_intensity", 0)
    
    if prediction == "Malignant":
        return f"CRITICAL: High AI activation ({confidence}% confidence) concentrated over peripheral lung parenchyma (peak activation area {area}%). Features indicate spiculated high-density soft tissue mass. Urgent radiological follow-up and tissue biopsy recommended."
    elif prediction == "Benign":
        return f"ATTENTION: Moderate AI activation ({confidence}% confidence) detected in localized pulmonary region (area {area}%). Features display smooth, well-demarcated nodular opacity. Annual high-resolution CT monitoring recommended."
    else:
        return f"NORMAL FINDING: Standard low-density pulmonary lung parenchymal patterns ({confidence}% confidence). No suspicious focal opacities or architectural distortion identified."

@router.post("/predict")
async def predict_image(
    file: UploadFile = File(None),
    sample_id: str = Form(None)
):
    try:
        unique_prefix = f"scan_{uuid.uuid4().hex[:10]}"
        contents = None
        filename = "ct_scan.png"
        
        # 1. Check if user uploaded a file
        if file is not None and file.filename and len(file.filename.strip()) > 0:
            filename = file.filename
            contents = await file.read()
            if not contents or len(contents) == 0:
                raise HTTPException(status_code=400, detail="Uploaded file is empty.")
            pil_img, img_np_224, tensor = process_uploaded_image(contents)
            
        # 2. Check if user selected a preset sample scan
        elif sample_id and len(sample_id.strip()) > 0:
            sample_filename_map = {
                "normal_sample": "sample_normal.png",
                "benign_sample": "sample_benign.png",
                "malignant_sample": "sample_malignant.png"
            }
            if sample_id not in sample_filename_map:
                raise HTTPException(status_code=404, detail=f"Sample ID '{sample_id}' not found.")
            
            sample_file = sample_filename_map[sample_id]
            sample_path = os.path.join(SAMPLES_DIR, sample_file)
            
            # Ensure sample exists
            if not os.path.exists(sample_path):
                from app.services.sample_generator import ensure_sample_scans
                ensure_sample_scans(SAMPLES_DIR)
                
            if not os.path.exists(sample_path):
                raise HTTPException(status_code=500, detail=f"Sample image '{sample_file}' missing on server.")
                
            filename = sample_file
            with open(sample_path, "rb") as f:
                contents = f.read()
            pil_img, img_np_224, tensor = process_uploaded_image(contents)
            
        else:
            raise HTTPException(status_code=400, detail="Please upload a CT scan file or select a preset sample scan.")

        # Save original resized 224x224 image
        orig_filename = f"{unique_prefix}_orig.png"
        orig_path = os.path.join(ORIGINAL_DIR, orig_filename)
        pil_img.resize((224, 224)).save(orig_path)

        # Model inference
        model = get_model()
        predicted_class, confidence, probabilities, target_idx = predict_ct_scan(tensor, img_np_224)

        # Generate Grad-CAM heatmaps & overlay directly in target folders
        heatmap_fn, overlay_fn, roi_stats = generate_gradcam_outputs(
            model=model,
            input_tensor=tensor,
            target_class_idx=target_idx,
            img_np=img_np_224,
            heatmap_dir=HEATMAP_DIR,
            overlay_dir=OVERLAY_DIR,
            filename_prefix=unique_prefix
        )
        
        # Clinical rationale text
        clinical_notes = generate_clinical_notes(predicted_class, confidence, roi_stats)
        
        # Paths for frontend
        heatmap_url_path = f"/static/heatmaps/{heatmap_fn}"
        overlay_url_path = f"/static/overlays/{overlay_fn}"
        original_url_path = f"/static/original/{orig_filename}"
        
        # Save record to DB
        record_id = save_prediction(
            filename=filename,
            prediction=predicted_class,
            confidence=confidence,
            probabilities=probabilities,
            heatmap_path=heatmap_url_path,
            overlay_path=overlay_url_path,
            original_path=original_url_path,
            clinical_notes=clinical_notes
        )

        return {
            "id": record_id,
            "filename": filename,
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": probabilities,
            "heatmap": heatmap_url_path,
            "overlay": overlay_url_path,
            "original": original_url_path,
            "clinical_notes": clinical_notes,
            "roi_stats": roi_stats
        }

    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"XAI Engine Error: {str(e)}")


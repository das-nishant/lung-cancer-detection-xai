from fastapi import APIRouter
import os
from app.services.sample_generator import ensure_sample_scans

router = APIRouter()

SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../uploads/samples"))

@router.get("/samples")
def get_sample_scans():
    samples = ensure_sample_scans(SAMPLES_DIR)
    for s in samples:
        s["url"] = f"/static/samples/{s['filename']}"
    return {"samples": samples}

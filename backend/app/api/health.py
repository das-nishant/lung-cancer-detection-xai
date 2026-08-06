from fastapi import APIRouter
import torch
import sys

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Explainable Lung Cancer Classification API (XAI)",
        "python_version": sys.version,
        "pytorch_version": torch.__version__,
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }

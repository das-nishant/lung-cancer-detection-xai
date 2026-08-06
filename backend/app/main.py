from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database.db import init_db
from app.services.sample_generator import ensure_sample_scans
from app.api import health, predict, history, samples

app = FastAPI(
    title="Explainable Lung Cancer Classification System (XAI)",
    description="AI-powered diagnostic support API with Grad-CAM visual explanations",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database and sample files are initialized
init_db()
UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../uploads"))
SAMPLES_DIR = os.path.join(UPLOADS_DIR, "samples")
ensure_sample_scans(SAMPLES_DIR)

# Mount static uploads directory for serving images and heatmaps
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOADS_DIR), name="static")

# Include Routers
app.include_router(health.router)
app.include_router(predict.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")
app.include_router(samples.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

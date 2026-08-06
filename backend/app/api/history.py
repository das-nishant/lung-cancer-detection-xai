from fastapi import APIRouter, HTTPException
from app.database.db import get_all_predictions, delete_prediction

router = APIRouter()

@router.get("/predictions")
def get_prediction_history():
    predictions = get_all_predictions()
    return {"predictions": predictions, "total": len(predictions)}

@router.delete("/predictions/{id}")
def remove_prediction(id: int):
    success = delete_prediction(id)
    if not success:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
    return {"message": "Prediction deleted successfully", "id": id}

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "lung_xai.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                probabilities TEXT NOT NULL,
                heatmap_path TEXT NOT NULL,
                overlay_path TEXT NOT NULL,
                original_path TEXT NOT NULL,
                clinical_notes TEXT,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()

def save_prediction(filename: str, prediction: str, confidence: float, probabilities: dict, heatmap_path: str, overlay_path: str, original_path: str, clinical_notes: str = ""):
    created_at = datetime.utcnow().isoformat() + "Z"
    prob_json = json.dumps(probabilities)
    
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions (filename, prediction, confidence, probabilities, heatmap_path, overlay_path, original_path, clinical_notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (filename, prediction, confidence, prob_json, heatmap_path, overlay_path, original_path, clinical_notes, created_at))
        conn.commit()
        return cursor.lastrowid

def get_all_predictions():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM predictions ORDER BY id DESC")
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            item = dict(row)
            try:
                item["probabilities"] = json.loads(item["probabilities"])
            except Exception:
                item["probabilities"] = {}
            results.append(item)
        return results

def delete_prediction(prediction_id: int):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
        conn.commit()
        return cursor.rowcount > 0


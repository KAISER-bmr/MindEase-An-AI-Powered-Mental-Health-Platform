from fastapi import APIRouter, Depends
from database import get_db, execute_query
from models import MoodLog, MoodLogResponse
from dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/mood", tags=["Mood Tracking"])

MOOD_LABELS = {
    (1, 2): "Very Low",
    (3, 4): "Low",
    (5, 6): "Moderate",
    (7, 8): "Good",
    (9, 10): "Excellent"
}

def get_mood_label(score: int) -> str:
    for (low, high), label in MOOD_LABELS.items():
        if low <= score <= high:
            return label
    return "Unknown"

@router.post("/log")
def log_mood(data: MoodLog, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    label = data.mood_label or get_mood_label(data.mood_score)
    log_id = execute_query(
        db,
        """INSERT INTO mood_logs (user_id, mood_score, mood_label, notes, stress_level, anxiety_level, sleep_hours)
           VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (current_user["id"], data.mood_score, label, data.notes, data.stress_level, data.anxiety_level, data.sleep_hours)
    )
    return {"id": log_id, "message": "Mood logged successfully", "mood_label": label}

@router.get("/history")
def get_mood_history(limit: int = 30, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    logs = execute_query(
        db,
        "SELECT * FROM mood_logs WHERE user_id=%s ORDER BY logged_at DESC LIMIT %s",
        (current_user["id"], limit), fetch=True
    )
    return logs

@router.get("/stats")
def get_mood_stats(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    stats = execute_query(
        db,
        """SELECT 
               AVG(mood_score) as avg_mood,
               AVG(stress_level) as avg_stress,
               AVG(anxiety_level) as avg_anxiety,
               AVG(sleep_hours) as avg_sleep,
               MIN(mood_score) as min_mood,
               MAX(mood_score) as max_mood,
               COUNT(*) as total_logs
           FROM mood_logs WHERE user_id=%s""",
        (current_user["id"],), fetch=True
    )
    return stats[0] if stats else {}

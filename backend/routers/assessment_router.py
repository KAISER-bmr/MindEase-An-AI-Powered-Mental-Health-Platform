from fastapi import APIRouter, Depends
from database import get_db, execute_query
from models import AssessmentSubmit, AssessmentResult
from dependencies import get_current_user
import json

router = APIRouter(prefix="/assessment", tags=["Assessment"])

# PHQ-9 style scoring
def score_assessment(responses: list, assessment_type: str) -> tuple:
    total = sum(responses)
    if assessment_type == "phq9":  # Depression
        if total <= 4: return total, "low", "Minimal or no depression symptoms"
        if total <= 9: return total, "low", "Mild depression symptoms"
        if total <= 14: return total, "moderate", "Moderate depression symptoms"
        if total <= 19: return total, "moderate", "Moderately severe depression"
        return total, "high", "Severe depression symptoms detected"
    elif assessment_type == "gad7":  # Anxiety
        if total <= 4: return total, "low", "Minimal anxiety"
        if total <= 9: return total, "low", "Mild anxiety"
        if total <= 14: return total, "moderate", "Moderate anxiety"
        return total, "high", "Severe anxiety symptoms detected"
    else:  # General stress
        max_score = len(responses) * 3
        pct = total / max_score if max_score > 0 else 0
        if pct < 0.33: return total, "low", "Low stress levels"
        if pct < 0.66: return total, "moderate", "Moderate stress levels"
        return total, "high", "High stress levels detected"

RECOMMENDATIONS = {
    "low": [
        "Continue your current healthy habits",
        "Practice regular mindfulness or meditation",
        "Maintain a consistent sleep schedule",
        "Stay connected with friends and family"
    ],
    "moderate": [
        "Consider speaking with a college counselor",
        "Try daily relaxation techniques (deep breathing, journaling)",
        "Limit caffeine and prioritize 7-9 hours of sleep",
        "Break tasks into smaller steps to reduce overwhelm",
        "Join a student support group"
    ],
    "high": [
        "Please reach out to a mental health professional immediately",
        "Contact your college's counseling center today",
        "Crisis helpline: iCall - 9152987821",
        "Talk to a trusted friend, family member, or faculty advisor",
        "Vandrevala Foundation (24/7): 1860-2662-345"
    ]
}

@router.post("/submit", response_model=AssessmentResult)
def submit_assessment(data: AssessmentSubmit, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    score, risk_level, message = score_assessment(data.responses, data.assessment_type)
    
    execute_query(
        db,
        "INSERT INTO assessments (user_id, assessment_type, responses, risk_level, score) VALUES (%s,%s,%s,%s,%s)",
        (current_user["id"], data.assessment_type, json.dumps(data.responses), risk_level, score)
    )
    
    return AssessmentResult(
        score=score,
        risk_level=risk_level,
        message=message,
        recommendations=RECOMMENDATIONS[risk_level]
    )

@router.get("/history")
def get_assessment_history(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    return execute_query(
        db,
        "SELECT id, assessment_type, risk_level, score, taken_at FROM assessments WHERE user_id=%s ORDER BY taken_at DESC",
        (current_user["id"],), fetch=True
    )

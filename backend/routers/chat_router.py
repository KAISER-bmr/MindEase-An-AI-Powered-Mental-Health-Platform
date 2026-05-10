from fastapi import APIRouter, Depends, HTTPException
from database import get_db, execute_query
from models import ChatMessage, ChatResponse, MessageResponse
from ai_service import get_ai_response, analyze_sentiment
from dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/message", response_model=ChatResponse)
def send_message(data: ChatMessage, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    user_id = current_user["id"]

    # Create or reuse session
    if data.session_id:
        sessions = execute_query(db, "SELECT id FROM chat_sessions WHERE id=%s AND user_id=%s", (data.session_id, user_id), fetch=True)
        if not sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        session_id = data.session_id
    else:
        session_id = execute_query(db, "INSERT INTO chat_sessions (user_id) VALUES (%s)", (user_id,))

    # Fetch conversation history (last 10 messages)
    history_rows = execute_query(
        db,
        "SELECT role, content FROM messages WHERE session_id=%s ORDER BY created_at ASC LIMIT 10",
        (session_id,), fetch=True
    )
    history = [{"role": r["role"], "content": r["content"]} for r in history_rows]

    # Sentiment analysis on user message
    sentiment = analyze_sentiment(data.content)

    # Save user message
    user_msg_id = execute_query(
        db,
        "INSERT INTO messages (session_id, user_id, role, content, sentiment_score) VALUES (%s,%s,'user',%s,%s)",
        (session_id, user_id, data.content, sentiment)
    )

    # Get AI response
    ai_text = get_ai_response(data.content, history)

    # Save AI message
    ai_msg_id = execute_query(
        db,
        "INSERT INTO messages (session_id, user_id, role, content) VALUES (%s,%s,'assistant',%s)",
        (session_id, user_id, ai_text)
    )

    return ChatResponse(
        session_id=session_id,
        user_message=MessageResponse(id=user_msg_id, role="user", content=data.content, session_id=session_id),
        ai_message=MessageResponse(id=ai_msg_id, role="assistant", content=ai_text, session_id=session_id)
    )

@router.get("/sessions")
def get_sessions(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    sessions = execute_query(
        db,
        "SELECT cs.id, cs.started_at, COUNT(m.id) as message_count FROM chat_sessions cs LEFT JOIN messages m ON cs.id=m.session_id WHERE cs.user_id=%s GROUP BY cs.id ORDER BY cs.started_at DESC",
        (current_user["id"],), fetch=True
    )
    return sessions

@router.get("/sessions/{session_id}/messages")
def get_messages(session_id: int, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    messages = execute_query(
        db,
        "SELECT id, role, content, sentiment_score, created_at FROM messages WHERE session_id=%s AND user_id=%s ORDER BY created_at ASC",
        (session_id, current_user["id"]), fetch=True
    )
    return messages

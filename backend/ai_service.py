"""
ai_service.py
─────────────
Uses OpenRouter API (free tier) instead of Anthropic SDK.
Drop-in replacement — all other files stay unchanged.

To use:
  1. Put your OpenRouter key in backend/.env:
         ANTHROPIC_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
  2. pip install httpx
  3. Restart the server normally.
"""

import httpx
from config import settings

SYSTEM_PROMPT = """You are MindEase, a compassionate and empathetic AI mental health support companion designed specifically for college students. Your role is to:

1. Provide emotional support and a safe, non-judgmental space for students to express themselves
2. Help identify signs of stress, anxiety, and mental health challenges through conversation
3. Offer evidence-based coping strategies (deep breathing, journaling, mindfulness, etc.)
4. Encourage healthy habits: sleep, exercise, social connection, academic balance
5. Recognize crisis situations and always recommend professional help when needed
6. Use warm, conversational language appropriate for college students

IMPORTANT GUIDELINES:
- Never diagnose or prescribe medication
- Always validate feelings before offering advice
- If a student expresses thoughts of self-harm or suicide, immediately provide crisis resources:
  * iCall India: 9152987821
  * Vandrevala Foundation: 1860-2662-345 (24/7)
  * NIMHANS: 080-46110007
- Keep responses concise (2-4 paragraphs) and conversational
- Ask follow-up questions to understand the student's situation better
- Gently suggest professional counseling when appropriate

You are NOT a replacement for professional mental health care. You are a supportive companion."""


def get_ai_response(user_message: str, conversation_history: list) -> str:
    """Generate an AI response using OpenRouter."""
    full_messages = (
        [{"role": "system", "content": SYSTEM_PROMPT}]
        + conversation_history
        + [{"role": "user", "content": user_message}]
    )

    import asyncio
    return asyncio.run(_call_openrouter(full_messages))


def analyze_sentiment(text: str) -> float:
    """Analyze sentiment. Returns -1.0 (very negative) to 1.0 (very positive)."""
    messages = [
        {"role": "system", "content": "You are a sentiment analysis assistant."},
        {
            "role": "user",
            "content": (
                f"Rate the emotional sentiment of this text on a scale from -1.0 "
                f"(very negative/distressed) to 1.0 (very positive/happy). "
                f"Respond with ONLY the number, nothing else.\n\nText: \"{text}\""
            ),
        },
    ]

    import asyncio
    try:
        result = asyncio.run(_call_openrouter(messages, max_tokens=10))
        score = float(result.strip())
        return max(-1.0, min(1.0, score))
    except Exception:
        return 0.0


async def _call_openrouter(messages: list, max_tokens: int = 1024) -> str:
    """Internal async helper that calls the OpenRouter API."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.ANTHROPIC_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "anthropic/claude-3-haiku",
                "messages": messages,
                "max_tokens": max_tokens,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"]
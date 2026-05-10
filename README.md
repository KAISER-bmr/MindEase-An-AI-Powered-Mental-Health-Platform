# 🌱 MindEase — AI Mental Health Support Platform

A full-stack web application built for college students to get emotional support, track their mood, and take mental health self-assessments.

---

## 🏗️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React 18, React Router, Recharts |
| Backend    | Python 3.10+, FastAPI       |
| Database   | MySQL 8+                    |
| AI         | Anthropic Claude API        |
| Auth       | JWT (python-jose + bcrypt)  |

---

## 📁 Project Structure

```
mindease/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings from .env
│   ├── database.py          # MySQL connection pool
│   ├── auth.py              # JWT + password hashing
│   ├── dependencies.py      # Auth middleware
│   ├── models.py            # Pydantic schemas
│   ├── ai_service.py        # Anthropic API integration
│   ├── schema.sql           # MySQL table definitions
│   ├── requirements.txt
│   ├── .env.example
│   └── routers/
│       ├── auth_router.py
│       ├── chat_router.py
│       ├── mood_router.py
│       └── assessment_router.py
│
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── api.js           # Axios client
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   └── Layout.js    # Sidebar navigation
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            ├── Chat.js
            ├── MoodTracker.js
            └── Assessment.js
```

---

## ⚡ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+
- An Anthropic API key (get one at https://console.anthropic.com)

---

### Step 1 — MySQL Database

```bash
# Log into MySQL
mysql -u root -p

# Run the schema
source /path/to/mindease/backend/schema.sql
# OR
mysql -u root -p < backend/schema.sql
```

---

### Step 2 — Backend Setup

```bash
cd mindease/backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Now edit `.env` with your values:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mindease
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=any-long-random-string-here

ANTHROPIC_API_KEY=sk-ant-...your-key...
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000
📖 API docs at: http://localhost:8000/docs

---

### Step 3 — Frontend Setup

```bash
cd mindease/frontend

# Install packages
npm install

# Start the React app
npm start
```

✅ Frontend running at: http://localhost:3000

---

## 🔑 Features

### 💬 AI Chat
- Conversational emotional support powered by Claude
- Full chat history saved per session
- Sentiment analysis on user messages
- Crisis helpline info automatically included

### 📊 Mood Tracker
- Daily mood logging (1–10 score)
- Stress, anxiety, and sleep tracking
- Visual charts (mood over time, stress/anxiety trends)
- Entry history

### 📋 Self-Assessments
- **PHQ-9** – Depression screening
- **GAD-7** – Anxiety screening
- **PSS** – Perceived Stress Scale
- Automatic risk scoring (Low / Moderate / High)
- Personalised recommendations
- Full assessment history

### 🔐 Authentication
- Secure registration & login
- JWT tokens with 24h expiry
- Protected routes on both frontend and backend

---

## 🆘 Crisis Resources (India)

| Resource | Number |
|----------|--------|
| iCall | 9152987821 |
| Vandrevala Foundation (24/7) | 1860-2662-345 |
| NIMHANS | 080-46110007 |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create account |
| POST | /auth/login | Login & get token |
| POST | /chat/message | Send message, get AI reply |
| GET  | /chat/sessions | List all chat sessions |
| GET  | /chat/sessions/{id}/messages | Get messages in session |
| POST | /mood/log | Log mood entry |
| GET  | /mood/history | Get mood logs |
| GET  | /mood/stats | Get mood statistics |
| POST | /assessment/submit | Submit assessment |
| GET  | /assessment/history | Get assessment history |

---

## 🧪 Quick Test

1. Open http://localhost:3000
2. Click "Create an account"
3. Register with your name, email, password
4. You'll land on the Dashboard
5. Click "Talk to MindEase" to chat
6. Try "Log Today's Mood" to track your mood
7. Take a "Self-Assessment" for a health check

---

## ⚠️ Disclaimer

MindEase is an academic project providing emotional support tools. It is **not** a substitute for professional mental health care. If you or someone you know is in crisis, please contact a licensed mental health professional immediately.

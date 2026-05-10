from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db, execute_query
from auth import hash_password, verify_password, create_access_token
from models import UserRegister, UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db=Depends(get_db)):
    # Check if email exists
    existing = execute_query(db, "SELECT id FROM users WHERE email = %s", (data.email,), fetch=True)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(data.password)
    user_id = execute_query(
        db,
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (data.name, data.email, hashed)
    )
    token = create_access_token({"sub": str(user_id), "email": data.email})
    return TokenResponse(access_token=token, user_id=user_id, name=data.name)

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db=Depends(get_db)):
    users = execute_query(db, "SELECT * FROM users WHERE email = %s", (data.email,), fetch=True)
    if not users:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = users[0]
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
    return TokenResponse(access_token=token, user_id=user["id"], name=user["name"])

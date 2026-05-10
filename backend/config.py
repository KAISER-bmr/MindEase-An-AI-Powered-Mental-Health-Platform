from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "mindease"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    JWT_SECRET: str = "change-this-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    ANTHROPIC_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

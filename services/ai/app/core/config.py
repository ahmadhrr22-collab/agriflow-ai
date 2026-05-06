from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    api_key: str = "internal-secret-key"
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
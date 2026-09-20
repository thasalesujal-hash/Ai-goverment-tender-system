import json
from functools import lru_cache
from typing import Any, List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ai-tender-assistant"
    environment: str = "development"
    debug: bool = True

    # Primary canonical settings required by Module 2
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/tender_ai"
    REDIS_URL: str = "redis://redis:6379/0"
    QDRANT_URL: str = "http://qdrant:6333"
    S3_ENDPOINT: str = "http://minio:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin123"

    # Additional settings for full system compatibility
    OPENAI_API_KEY: str = ""
    QWEN_API_KEY: str = ""
    S3_BUCKET: str = "tender-documents"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    JWT_SECRET_KEY: str = "dev-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@aitender.com"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if not v.strip():
                return ["http://localhost:3000"]
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    def __getattr__(self, name: str) -> Any:
        upper_name = name.upper()
        if upper_name in self.__fields_set__ or hasattr(self, upper_name):
            return getattr(self, upper_name)
        lower_name = name.lower()
        if lower_name in self.__fields_set__ or hasattr(self, lower_name):
            return getattr(self, lower_name)
        raise AttributeError(f"'{type(self).__name__}' object has no attribute '{name}'")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

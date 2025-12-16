from pydantic_settings import BaseSettings

from pydantic import Field

class Settings(BaseSettings):
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = Field(alias="DB_USERNAME")
    DB_PASSWORD: str = ""
    DB_NAME: str = Field(alias="DB_DATABASE")
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
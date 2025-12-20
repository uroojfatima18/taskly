from sqlmodel import SQLModel, create_engine, Session, text
from pydantic_settings import BaseSettings
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

# -------------------------
# Settings
# -------------------------
class Settings(BaseSettings):
    database_url: str
    better_auth_secret: str
    environment: str = "development"

    class Config:
        env_file = ".env"
        env_prefix = ""
        fields = {
            "database_url": {"env": "DATABASE_URL"},
            "better_auth_secret": {"env": "BETTER_AUTH_SECRET"},
        }

@lru_cache
def get_settings() -> Settings:
    return Settings()

# -------------------------
# Engine & DB Initialization
# -------------------------
engine = None

def get_engine():
    global engine
    if engine is None:
        settings = get_settings()
        engine = create_engine(settings.database_url, echo=True)  # echo=True for debug
    return engine

def init_db():
    """Create all tables defined in SQLModel subclasses and run migrations."""
    engine = get_engine()
    SQLModel.metadata.create_all(engine)

    # Run schema migrations for existing tables
    _run_migrations(engine)


def _run_migrations(engine):
    """Add missing columns to existing tables."""
    with Session(engine) as session:
        # Check if password_hash column exists in users table
        try:
            result = session.exec(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'password_hash'
            """))
            column_exists = result.first() is not None

            if not column_exists:
                logger.info("Adding password_hash column to users table...")
                session.exec(text("""
                    ALTER TABLE users
                    ADD COLUMN password_hash VARCHAR(255) DEFAULT ''
                """))
                session.commit()
                logger.info("password_hash column added successfully")
        except Exception as e:
            logger.warning(f"Migration check failed (table may not exist yet): {e}")
            session.rollback()

# -------------------------
# Session Generator
# -------------------------
def get_session():
    """Yield a session for FastAPI dependency injection."""
    with Session(get_engine()) as session:
        yield session

# -------------------------
# Quick Check (Optional)
# -------------------------
if __name__ == "__main__":
    init_db()
    print("✅ Database initialized successfully")
    print("Using URL:", get_settings().database_url)

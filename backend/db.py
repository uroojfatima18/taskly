from typing import Optional
from sqlmodel import SQLModel, create_engine, Session, text
from pydantic_settings import BaseSettings
from functools import lru_cache
import logging
import base64

logger = logging.getLogger(__name__)

# -------------------------
# Settings
# -------------------------
class Settings(BaseSettings):
    # Option 1: Single DATABASE_URL
    database_url: Optional[str] = None

    # Option 2: Separate DB variables
    db_host: Optional[str] = None
    db_user: Optional[str] = None
    db_pass: Optional[str] = None
    dbname: Optional[str] = None

    # Option 3: Base64 encoded DATABASE_URL
    db_url_encoded: Optional[str] = None

    better_auth_secret: str
    environment: str = "development"

    class Config:
        env_file = ".env"
        env_prefix = ""
        fields = {
            "database_url": {"env": "DATABASE_URL"},
            "db_host": {"env": "DB_HOST"},
            "db_user": {"env": "DB_USER"},
            "db_pass": {"env": "DB_PASS"},
            "dbname": {"env": "DBNAME"},
            "db_url_encoded": {"env": "DB_URL_ENCODED"},
            "better_auth_secret": {"env": "BETTER_AUTH_SECRET"},
        }

    def get_database_url(self) -> str:
        """Build database URL from DATABASE_URL, encoded URL, or separate parts."""
        # Option 1: Direct DATABASE_URL
        if self.database_url:
            return self.database_url

        # Option 3: Base64 encoded URL
        if self.db_url_encoded:
            try:
                decoded = base64.b64decode(self.db_url_encoded).decode("utf-8")
                return decoded
            except Exception as e:
                raise ValueError(f"Failed to decode DB_URL_ENCODED: {e}")

        # Option 2: Separate parts
        if all([self.db_host, self.db_user, self.db_pass, self.dbname]):
            return f"postgresql://{self.db_user}:{self.db_pass}@{self.db_host}/{self.dbname}?sslmode=require"

        raise ValueError(
            "Database not configured. Provide DATABASE_URL, DB_URL_ENCODED, or all of: DB_HOST, DB_USER, DB_PASS, DBNAME"
        )

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
        engine = create_engine(
            settings.get_database_url(),
            echo=False,  # Disable SQL logging for performance
            pool_pre_ping=True,  # Test connections before using them
            pool_size=5,  # Number of connections to maintain
            max_overflow=10,  # Max additional connections when pool is full
            connect_args={
                "connect_timeout": 10,
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5,
            }
        )
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
    print("Using URL:", get_settings().get_database_url())

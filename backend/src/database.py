from typing import Generator
from sqlalchemy.orm import Session
from db import get_session


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI to get database session.
    This follows the same pattern as the existing db.py file.
    """
    db = next(get_session())
    try:
        yield db
    finally:
        db.close()
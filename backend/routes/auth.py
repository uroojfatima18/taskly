import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from jose import jwt

from db import get_session, get_settings
from models import User
from schemas import SignupRequest, LoginRequest, AuthResponse, UserResponse
from utils.password import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def create_access_token(user_id: str) -> str:
    """Create JWT access token for user."""
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(
    data: SignupRequest,
    session: Session = Depends(get_session),
):
    """Register a new user account."""
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == data.email.lower())
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=data.email.lower(),
        name=data.name,
        password_hash=hash_password(data.password),
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate token
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    session: Session = Depends(get_session),
):
    """Authenticate user and return access token."""
    # Find user by email
    user = session.exec(
        select(User).where(User.email == data.email.lower())
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate token
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/demo", response_model=AuthResponse)
def demo_login(
    session: Session = Depends(get_session),
):
    """Get a demo user token for testing. Creates demo user if not exists.

    This endpoint is disabled in production for security.
    """
    settings = get_settings()

    # Block demo endpoint in production
    if settings.environment == "production":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo login is disabled in production",
        )

    demo_email = "demo@taskflow.app"
    demo_id = "demo-user-001"

    # Check if demo user exists
    user = session.exec(
        select(User).where(User.email == demo_email)
    ).first()

    if not user:
        # Create demo user
        user = User(
            id=demo_id,
            email=demo_email,
            name="Demo User",
            password_hash=hash_password("demo123"),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    # Generate token
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user=UserResponse.model_validate(user),
    )


from fastapi import Request, HTTPException, status
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError
from typing import Optional
import os
from functools import wraps


class JWTBearer(HTTPBearer):
    """
    JWT Authentication middleware for chat endpoints.
    Validates JWT tokens from Better Auth system and extracts user information.
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication scheme."
                )
            token = credentials.credentials
            user_id = self.verify_jwt(token)
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token or expired token."
                )
            # Store user_id in request state for use in route handlers
            request.state.user_id = user_id
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header."
            )

    def verify_jwt(self, jwtoken: str) -> Optional[str]:
        """
        Verify the JWT token and extract the user ID.
        This assumes the token follows Better Auth standards.
        """
        try:
            # Get secret from environment
            secret = os.getenv("JWT_SECRET_KEY")
            if not secret:
                raise ValueError("JWT_SECRET_KEY not set in environment")

            # Decode the token
            payload = jwt.decode(jwtoken, secret, algorithms=["HS256"])

            # Extract user ID - Better Auth typically stores it as 'id' or 'userId'
            user_id = payload.get('id') or payload.get('userId') or payload.get('sub')

            if not user_id:
                return None

            return str(user_id)
        except PyJWTError:
            return None


def get_current_user_id(request: Request) -> str:
    """
    Helper function to get the current user ID from the request state.
    Should be called after JWT middleware has verified the token.
    """
    if hasattr(request.state, 'user_id'):
        return request.state.user_id
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in request state. Authentication middleware not applied?"
        )
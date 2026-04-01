# Password hashing utilities using argon2-cffi directly
# NOTE: We bypass passlib here because passlib has a known compatibility bug
# with argon2-cffi >= 21.2.0 where verify() always returns False.
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

# Configure argon2id with reduced time cost for faster hashing (still secure)
_ph = PasswordHasher(
    time_cost=1,
    memory_cost=65536,
    parallelism=4,
)

def hash_password(password: str) -> str:
    """
    Hash a password safely using argon2id.
    Argon2 doesn't have the 72-byte limitation that bcrypt has.
    """
    return _ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its argon2id hash.
    Returns False on mismatch or any error (invalid hash, etc).
    """
    try:
        return _ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False
    except Exception:
        return False

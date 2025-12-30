# Password hashing utilities using passlib with bcrypt
from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a password safely, supports passwords longer than 72 characters.
    Pre-hash with SHA256 to ensure bcrypt byte limit is not exceeded.
    """
    # SHA256 pre-hash produces 64-character hex string
    pre_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return pwd_context.hash(pre_hash)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    Pre-hash the input password the same way as during hashing.
    """
    pre_hash = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return pwd_context.verify(pre_hash, hashed_password)

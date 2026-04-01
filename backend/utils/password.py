# Password hashing utilities using passlib with argon2
from passlib.context import CryptContext

# Configure argon2 with reduced time cost for faster hashing (still secure)
# time_cost=1 reduces from ~2-3s to ~0.5s per hash
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__time_cost=1,
    argon2__memory_cost=65536,
    argon2__parallelism=4,
)

def hash_password(password: str) -> str:
    """
    Hash a password safely using argon2.
    Argon2 doesn't have the 72-byte limitation that bcrypt has.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

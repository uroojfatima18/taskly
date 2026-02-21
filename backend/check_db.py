
import os
from sqlmodel import create_engine, text, Session
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("DATABASE_URL not found in .env")
    exit(1)

print(f"Connecting to database...")
engine = create_engine(database_url)

try:
    with Session(engine) as session:
        # Check connection
        session.exec(text("SELECT 1"))
        print("✅ Database connection successful")

        # Check tables
        result = session.exec(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = result.all()
        print(f"Tables found: {[t[0] for t in tables]}")

        # Check users table
        if any(t[0] == 'users' for t in tables):
            result = session.exec(text("SELECT COUNT(*) FROM users"))
            count = result.first()
            print(f"Users count: {count[0]}")
        else:
            print("❌ 'users' table not found")

except Exception as e:
    print(f"❌ Error: {e}")

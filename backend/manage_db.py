"""
Database management utility for clearing user accounts and data.
"""
from sqlmodel import Session, create_engine, select, delete
from db import get_settings
from models import User, Task
import sys


def clear_all_users(force=False):
    """Delete all users and their associated tasks from the database."""
    settings = get_settings()
    engine = create_engine(settings.get_database_url(), echo=False)
    
    with Session(engine) as session:
        try:
            # First, get count of users and tasks
            users_count = len(session.exec(select(User)).all())
            tasks_count = len(session.exec(select(Task)).all())
            
            print(f"🔍 Current state:")
            print(f"   Users: {users_count}")
            print(f"   Tasks: {tasks_count}")
            
            if users_count == 0:
                print("\n✅ No users to delete.")
                return
            
            # Confirm deletion (skip if force flag)
            if not force:
                confirmation = input(f"\n⚠️  This will delete ALL {users_count} users and {tasks_count} tasks. Continue? (yes/no): ")
                if confirmation.lower() != "yes":
                    print("❌ Deletion cancelled.")
                    return
            else:
                print(f"⚠️  Deleting ALL {users_count} users and {tasks_count} tasks...")
            
            # Step 1: Delete all tasks (respects foreign key constraint)
            statement = delete(Task)
            result = session.exec(statement)
            deleted_tasks = result.rowcount
            print(f"\n🗑️  Deleted {deleted_tasks} tasks")
            
            # Step 2: Delete all users
            statement = delete(User)
            result = session.exec(statement)
            deleted_users = result.rowcount
            print(f"🗑️  Deleted {deleted_users} users")
            
            # Commit changes
            session.commit()
            print("\n✅ Database cleared successfully!")
            print(f"   Deleted users: {deleted_users}")
            print(f"   Deleted tasks: {deleted_tasks}")
            
        except Exception as e:
            session.rollback()
            print(f"\n❌ Error clearing database: {e}")
            sys.exit(1)


if __name__ == "__main__":
    force = "--force" in sys.argv
    clear_all_users(force=force)

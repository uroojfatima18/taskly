from mcp.server.fastmcp import FastMCP
from sqlalchemy.orm import Session
from db import get_engine
from models import Task
import json

# Initialize FastMCP Server
mcp = FastMCP("Todo_MCP_Server")

@mcp.tool()
def add_task(user_id: str, title: str, description: str = None) -> str:
    """Create a new task for a specified user"""
    with Session(get_engine()) as session:
        task = Task(user_id=user_id, title=title, description=description)
        session.add(task)
        session.commit()
        session.refresh(task)
        return json.dumps({"task_id": task.id, "status": "created", "title": task.title})

@mcp.tool()
def list_tasks(user_id: str, status: str = "all") -> str:
    """Retrieve tasks from the list based on status ('all', 'pending', 'completed')"""
    with Session(get_engine()) as session:
        query = session.query(Task).filter(Task.user_id == user_id)
        if status == "pending":
            query = query.filter(Task.completed == False)
        elif status == "completed":
            query = query.filter(Task.completed == True)
        
        tasks = query.all()
        return json.dumps([
            {"id": t.id, "title": t.title, "completed": t.completed, "description": t.description}
            for t in tasks
        ])

@mcp.tool()
def complete_task(user_id: str, task_id: int) -> str:
    """Mark a task as complete"""
    with Session(get_engine()) as session:
        task = session.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
        if not task:
            return json.dumps({"error": "Task not found"})
        
        task.completed = True
        session.add(task)
        session.commit()
        return json.dumps({"task_id": task.id, "status": "completed", "title": task.title})

@mcp.tool()
def delete_task(user_id: str, task_id: int) -> str:
    """Remove a task from the list"""
    with Session(get_engine()) as session:
        task = session.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
        if not task:
            return json.dumps({"error": "Task not found"})
        
        session.delete(task)
        session.commit()
        return json.dumps({"task_id": task_id, "status": "deleted", "title": task.title})

@mcp.tool()
def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> str:
    """Modify an existing task's details"""
    with Session(get_engine()) as session:
        task = session.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
        if not task:
            return json.dumps({"error": "Task not found"})
        
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
            
        session.add(task)
        session.commit()
        return json.dumps({"task_id": task.id, "status": "updated", "title": task.title})

if __name__ == "__main__":
    # Start the MCP server using SSE or stdio
    mcp.run()

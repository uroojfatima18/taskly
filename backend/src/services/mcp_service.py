from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
from src.models.conversation import Message
import json


class MCPBaseTool(ABC):
    """
    Base class for all MCP tools that the AI agent can use to interact with the system.
    """

    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the tool with the given parameters and return the result.
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """
        Unique name of the tool.
        """
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """
        Description of what the tool does.
        """
        pass

    @property
    @abstractmethod
    def parameters(self) -> Dict[str, Any]:
        """
        JSON Schema defining the parameters for the tool.
        """
        pass


class MCPTaskService:
    """
    Service that implements MCP tools for task operations.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    async def get_task_tools(self) -> List[MCPBaseTool]:
        """
        Return all available task tools that can be used by the AI agent.
        """
        return [
            CreateTaskTool(self.db_session, self.user_id),
            ListTasksTool(self.db_session, self.user_id),
            UpdateTaskTool(self.db_session, self.user_id),
            DeleteTaskTool(self.db_session, self.user_id),
            CompleteTaskTool(self.db_session, self.user_id)
        ]


class CreateTaskTool(MCPBaseTool):
    """
    MCP Tool for creating new tasks.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    @property
    def name(self) -> str:
        return "add_task"

    @property
    def description(self) -> str:
        return "Create a new task with a title and optional description"

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the task (required)"
                },
                "description": {
                    "type": "string",
                    "description": "The description of the task (optional)"
                }
            },
            "required": ["title"]
        }

    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the task creation.
        """
        from models import Task

        title = kwargs.get('title')
        description = kwargs.get('description', '')

        # Import Task model here to avoid circular imports
        from models import Task

        # Create new task
        task = Task(
            title=title,
            description=description,
            user_id=self.user_id,
            completed=False
        )

        self.db_session.add(task)
        self.db_session.commit()
        self.db_session.refresh(task)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Successfully created task: {task.title}"
        }


class ListTasksTool(MCPBaseTool):
    """
    MCP Tool for listing tasks with optional filtering.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    @property
    def name(self) -> str:
        return "list_tasks"

    @property
    def description(self) -> str:
        return "List all tasks for the current user, with optional filtering by status"

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "enum": ["all", "pending", "completed"],
                    "description": "Filter tasks by status (default: all)"
                }
            }
        }

    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the task listing.
        """
        from models import Task
        from sqlalchemy import and_

        status_filter = kwargs.get('status', 'all')

        query = self.db_session.query(Task).filter(Task.user_id == self.user_id)

        if status_filter == 'pending':
            query = query.filter(Task.completed == False)
        elif status_filter == 'completed':
            query = query.filter(Task.completed == True)

        tasks = query.all()

        task_list = []
        for task in tasks:
            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat() if task.created_at else None
            })

        return {
            "success": True,
            "tasks": task_list,
            "count": len(task_list),
            "message": f"Found {len(task_list)} tasks"
        }


class UpdateTaskTool(MCPBaseTool):
    """
    MCP Tool for updating task details.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    @property
    def name(self) -> str:
        return "update_task"

    @property
    def description(self) -> str:
        return "Update an existing task by ID with new title and/or description"

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to update"
                },
                "title": {
                    "type": "string",
                    "description": "New title for the task (optional)"
                },
                "description": {
                    "type": "string",
                    "description": "New description for the task (optional)"
                }
            },
            "required": ["task_id"]
        }

    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the task update.
        """
        from models import Task

        task_id = kwargs.get('task_id')
        new_title = kwargs.get('title')
        new_description = kwargs.get('description')

        # Find the task
        task = self.db_session.query(Task).filter(
            Task.id == task_id,
            Task.user_id == self.user_id
        ).first()

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found or doesn't belong to user"
            }

        # Update fields if provided
        if new_title is not None:
            task.title = new_title
        if new_description is not None:
            task.description = new_description

        self.db_session.commit()
        self.db_session.refresh(task)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Successfully updated task: {task.title}"
        }


class DeleteTaskTool(MCPBaseTool):
    """
    MCP Tool for deleting tasks.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    @property
    def name(self) -> str:
        return "delete_task"

    @property
    def description(self) -> str:
        return "Delete a task by ID"

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to delete"
                }
            },
            "required": ["task_id"]
        }

    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the task deletion.
        """
        from models import Task

        task_id = kwargs.get('task_id')

        # Find the task
        task = self.db_session.query(Task).filter(
            Task.id == task_id,
            Task.user_id == self.user_id
        ).first()

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found or doesn't belong to user"
            }

        # Delete the task
        self.db_session.delete(task)
        self.db_session.commit()

        return {
            "success": True,
            "task_id": task_id,
            "message": f"Successfully deleted task: {task.title}"
        }


class CompleteTaskTool(MCPBaseTool):
    """
    MCP Tool for marking tasks as complete/incomplete.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

    @property
    def name(self) -> str:
        return "complete_task"

    @property
    def description(self) -> str:
        return "Mark a task as complete or incomplete by ID"

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to update completion status"
                },
                "completed": {
                    "type": "boolean",
                    "description": "Whether the task should be marked as completed (default: True)"
                }
            },
            "required": ["task_id"]
        }

    async def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the task completion update.
        """
        from models import Task

        task_id = kwargs.get('task_id')
        completed = kwargs.get('completed', True)

        # Find the task
        task = self.db_session.query(Task).filter(
            Task.id == task_id,
            Task.user_id == self.user_id
        ).first()

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found or doesn't belong to user"
            }

        # Update completion status
        task.completed = completed
        self.db_session.commit()
        self.db_session.refresh(task)

        status_str = "completed" if completed else "marked as pending"
        return {
            "success": True,
            "task_id": task.id,
            "message": f"Successfully {status_str} task: {task.title}"
        }
from datetime import datetime, timezone
from typing import Optional, Literal
from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session, select, col, func

from db import get_session
from models import Task
from schemas import (
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    TaskStatusUpdate,
    TaskListResponse,
)
from dependencies.auth import get_current_user
from utils.errors import not_found, forbidden

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("", response_model=TaskListResponse)
def list_tasks(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
    status_filter: Optional[Literal["all", "pending", "completed"]] = Query(
        default="all", alias="status"
    ),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=50),
):
    query = select(Task).where(Task.user_id == user_id)

    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    query = query.order_by(col(Task.created_at).desc())

    # Use SQL COUNT for efficient counting
    count_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    if status_filter == "pending":
        count_query = count_query.where(Task.completed == False)
    elif status_filter == "completed":
        count_query = count_query.where(Task.completed == True)

    total = session.exec(count_query).one()

    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    tasks = session.exec(query).all()

    return TaskListResponse(
        items=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    task = session.get(Task, task_id)
    if not task:
        raise not_found("Task")

    if task.user_id != user_id:
        raise forbidden("You don't have permission to update this task")

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description

    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_status(
    task_id: int,
    status_data: TaskStatusUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    task = session.get(Task, task_id)
    if not task:
        raise not_found("Task")

    if task.user_id != user_id:
        raise forbidden("You don't have permission to update this task")

    task.completed = status_data.completed
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    task = session.get(Task, task_id)
    if not task:
        raise not_found("Task")

    if task.user_id != user_id:
        raise forbidden("You don't have permission to delete this task")

    session.delete(task)
    session.commit()
    return None

---
title: Todo App API
emoji: ✅
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# Todo App API

FastAPI backend for Task CRUD operations with JWT authentication.

## Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login & get token
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/complete` - Toggle completion
- `DELETE /api/tasks/{id}` - Delete task

## API Docs

Visit `/docs` for Swagger UI documentation.

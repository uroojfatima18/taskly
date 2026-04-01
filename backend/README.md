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

## Getting Started (Local Development)

### 1. Setup Virtual Environment
It is highly recommended to use a virtual environment so dependencies don't conflict.

```bash
# Move into backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate
# OR (Mac/Linux)
# source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Make sure you have a `.env` file in the `backend` directory. You can use `.env.example` as a template:
```env
# Example .env configuration
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
BETTER_AUTH_SECRET=your_jwt_secret_key
ENVIRONMENT=development
```

### 4. Run the Server
```bash
uvicorn main:app --reload
```

The API will now be running at `http://localhost:8000`.

## API Docs

Visit `http://localhost:8000/docs` in your browser for the interactive Swagger UI documentation.

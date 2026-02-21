from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from db import init_db
from routes import tasks, health, auth
from src.api.chat_endpoints import router as chat_router
from middleware import LoggingMiddleware, RateLimitMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Todo App API",
    description="Backend API for Task CRUD operations",
    version="1.0.0",
    lifespan=lifespan,
)

# Add middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://0.0.0.0:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
app.add_middleware(LoggingMiddleware)

# app.include_router(health.router, prefix="/api")
# app.include_router(auth.router, prefix="/api")
# app.include_router(tasks.router, prefix="/api")


app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root():
    """Root endpoint - API info."""
    return {
        "name": "Todo App API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }
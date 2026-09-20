from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as users_router
from app.api.v1.tenders.router import router as tenders_router
from app.api.v1.chat.router import router as chat_router
from app.api.v1.bid.router import router as bid_router
from app.api.v1.admin.router import router as admin_router
from app.api.v1.notifications.router import router as notifications_router
from app.core.config import settings
from app.database.init_db import test_database_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: test database connection
    await test_database_connection()
    yield
    # Shutdown logic if any in future modules


app = FastAPI(
    title="AI Tender & Government Bid Assistant",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
app.include_router(tenders_router, prefix="/api/v1/tenders", tags=["tenders"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(bid_router, prefix="/api/v1/bid", tags=["bid"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["notifications"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "ai-tender-assistant"}

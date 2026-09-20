"""
pytest configuration and shared fixtures.

Uses an in-memory SQLite database (via aiosqlite) so tests can run
WITHOUT a live PostgreSQL instance.

The SQLite URL uses the asyncio driver:
    sqlite+aiosqlite:///:memory:

Note: Some PostgreSQL-specific constructs (ILIKE, server_default now())
are adjusted for SQLite compatibility in tests.
"""
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Import Base and ALL models so SQLite sees all table definitions
from app.database.base import Base
import app.models  # noqa: F401 — registers all 12 models


SQLITE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncSession:
    """
    Provide a fresh in-memory SQLite session for each test.
    Tables are created and dropped around each test function.
    """
    engine = create_async_engine(SQLITE_URL, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )

    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()

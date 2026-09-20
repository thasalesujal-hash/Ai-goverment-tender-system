import logging
from sqlalchemy import text

from app.database.session import engine

logger = logging.getLogger("app.database")


async def test_database_connection() -> bool:
    """Test that PostgreSQL is reachable by executing `SELECT 1` asynchronously."""
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            row = result.scalar_one_or_none()
            if row == 1:
                print(f"PostgreSQL connection successful: {row}")
                logger.info(f"PostgreSQL connection successful: {row}")
                return True
            else:
                print(f"PostgreSQL connection returned unexpected value: {row}")
                logger.warning(f"PostgreSQL connection returned unexpected value: {row}")
                return False
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        logger.error(f"PostgreSQL connection failed: {e}")
        return False


# Alias for compatibility
test_postgres_connection = test_database_connection

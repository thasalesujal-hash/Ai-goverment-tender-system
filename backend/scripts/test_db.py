import asyncio
from app.database.init_db import test_postgres_connection

async def main():
    ok = await test_postgres_connection()
    print("PostgreSQL connection successful:" , ok)

if __name__ == "__main__":
    asyncio.run(main())

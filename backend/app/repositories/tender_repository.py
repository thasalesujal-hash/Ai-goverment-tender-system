from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tender import Tender
from app.repositories.base import BaseRepository


class TenderRepository(BaseRepository[Tender]):
    def __init__(self, session: AsyncSession):
        super().__init__(session)

    async def list_tenders(self) -> list[Tender]:
        result = await self.session.execute(select(Tender))
        return list(result.scalars().all())

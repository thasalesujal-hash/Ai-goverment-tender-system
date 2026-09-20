from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: int
    title: str
    body: str
    is_read: bool

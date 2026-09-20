from app.models.user import User
from app.schemas.user import UserCreate


class UserService:
    async def create_user(self, payload: UserCreate) -> User:
        # Password hashing will be implemented in the authentication module later.
        return User(email=payload.email, full_name=payload.full_name, password_hash="placeholder")

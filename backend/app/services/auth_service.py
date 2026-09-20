from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse


class AuthService:
    async def login(self, payload: LoginRequest) -> TokenResponse:
        token = create_access_token(payload.email)
        return TokenResponse(access_token=token)

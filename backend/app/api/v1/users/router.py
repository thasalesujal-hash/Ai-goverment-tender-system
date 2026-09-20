from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_users() -> dict[str, str]:
    return {"message": "User management endpoint placeholder"}

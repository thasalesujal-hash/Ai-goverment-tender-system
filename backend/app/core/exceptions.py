class AppError(Exception):
    """Base application exception."""


class NotFoundError(AppError):
    pass


class ValidationError(AppError):
    pass


class UnauthorizedError(AppError):
    pass

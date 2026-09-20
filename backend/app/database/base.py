"""
Canonical SQLAlchemy Declarative Base for the AI Tender Assistant backend.

ALL models must inherit from this Base so that:
  - Alembic autogenerate can discover every table via Base.metadata
  - The same MetaData object is shared across the whole application
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Single application-wide declarative base.

    Import only from here — never create a second Base elsewhere.
    models/base.py re-exports this for convenience.
    """
    pass

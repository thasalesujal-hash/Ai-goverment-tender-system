"""initial create users companies tenders

Revision ID: 0001_initial_create_users_companies_tenders
Revises: 
Create Date: 2026-08-14 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_initial_create_users_companies_tenders'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('role', sa.String(length=50), server_default='user', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 2. Create companies table (references users.id)
    op.create_table(
        'companies',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('gst_number', sa.String(length=64), nullable=True),
        sa.Column('pan_number', sa.String(length=64), nullable=True),
        sa.Column('annual_turnover', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('experience_years', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_companies_id', 'companies', ['id'], unique=False)
    op.create_index('ix_companies_user_id', 'companies', ['user_id'], unique=False)

    # 3. Create tenders table
    op.create_table(
        'tenders',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_reference', sa.String(length=150), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('department', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('published_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('submission_deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('estimated_value', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('emd_amount', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('source_url', sa.String(length=1000), nullable=True),
        sa.Column('source_name', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='active', nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_tenders_id', 'tenders', ['id'], unique=False)
    op.create_index('ix_tenders_tender_reference', 'tenders', ['tender_reference'], unique=False)
    op.create_index('ix_tenders_department', 'tenders', ['department'], unique=False)
    op.create_index('ix_tenders_submission_deadline', 'tenders', ['submission_deadline'], unique=False)
    op.create_index('ix_tenders_source_name', 'tenders', ['source_name'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_tenders_source_name', table_name='tenders')
    op.drop_index('ix_tenders_submission_deadline', table_name='tenders')
    op.drop_index('ix_tenders_department', table_name='tenders')
    op.drop_index('ix_tenders_tender_reference', table_name='tenders')
    op.drop_index('ix_tenders_id', table_name='tenders')
    op.drop_table('tenders')

    op.drop_index('ix_companies_user_id', table_name='companies')
    op.drop_index('ix_companies_id', table_name='companies')
    op.drop_table('companies')

    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_table('users')

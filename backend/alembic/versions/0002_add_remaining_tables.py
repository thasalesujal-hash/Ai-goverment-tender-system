"""
Migration 0002: Add remaining tables

This migration adds the 10 tables that were missing from the initial migration (0001).
The existing users / companies / tenders tables are NOT touched.

Tables added:
  - tender_documents
  - tender_chunks
  - tender_metadata
  - tender_summaries
  - eligibility_reports
  - notifications
  - chat_history
  - bid_documents
  - audit_logs
  - api_keys

Revision ID: 0002_add_remaining_tables
Revises: 0001_initial_create_users_companies_tenders
Create Date: 2026-09-20 22:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0002_add_remaining_tables'
down_revision: Union[str, None] = '0001_initial_create_users_companies_tenders'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. tender_documents
    op.create_table(
        'tender_documents',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_name', sa.String(length=500), nullable=False),
        sa.Column('storage_key', sa.String(length=1000), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=True),
        sa.Column('extracted_text', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_tender_documents_id', 'tender_documents', ['id'], unique=False)
    op.create_index('ix_tender_documents_tender_id', 'tender_documents', ['tender_id'], unique=False)

    # 2. tender_chunks
    op.create_table(
        'tender_chunks',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_id', sa.Integer(), sa.ForeignKey('tender_documents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding_id', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_tender_chunks_id', 'tender_chunks', ['id'], unique=False)
    op.create_index('ix_tender_chunks_tender_id', 'tender_chunks', ['tender_id'], unique=False)

    # 3. tender_metadata
    op.create_table(
        'tender_metadata',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=False),
        sa.Column('source', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_tender_metadata_id', 'tender_metadata', ['id'], unique=False)
    op.create_index('ix_tender_metadata_tender_id', 'tender_metadata', ['tender_id'], unique=False)

    # 4. tender_summaries
    op.create_table(
        'tender_summaries',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('summary_text', sa.Text(), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_tender_summaries_id', 'tender_summaries', ['id'], unique=False)

    # 5. eligibility_reports
    op.create_table(
        'eligibility_reports',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('report_text', sa.Text(), nullable=False),
        sa.Column('score', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('generated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_eligibility_reports_id', 'eligibility_reports', ['id'], unique=False)

    # 6. notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_notifications_id', 'notifications', ['id'], unique=False)
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'], unique=False)

    # 7. chat_history
    op.create_table(
        'chat_history',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='SET NULL'), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_chat_history_id', 'chat_history', ['id'], unique=False)
    op.create_index('ix_chat_history_user_id', 'chat_history', ['user_id'], unique=False)

    # 8. bid_documents
    op.create_table(
        'bid_documents',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('tender_id', sa.Integer(), sa.ForeignKey('tenders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_bid_documents_id', 'bid_documents', ['id'], unique=False)

    # 9. audit_logs
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('actor', sa.String(length=255), nullable=True),
        sa.Column('action', sa.String(length=255), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_audit_logs_id', 'audit_logs', ['id'], unique=False)

    # 10. api_keys
    op.create_table(
        'api_keys',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('key_hash', sa.String(length=255), unique=True, nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_api_keys_id', 'api_keys', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_api_keys_id', table_name='api_keys')
    op.drop_table('api_keys')

    op.drop_index('ix_audit_logs_id', table_name='audit_logs')
    op.drop_table('audit_logs')

    op.drop_index('ix_bid_documents_id', table_name='bid_documents')
    op.drop_table('bid_documents')

    op.drop_index('ix_chat_history_user_id', table_name='chat_history')
    op.drop_index('ix_chat_history_id', table_name='chat_history')
    op.drop_table('chat_history')

    op.drop_index('ix_notifications_user_id', table_name='notifications')
    op.drop_index('ix_notifications_id', table_name='notifications')
    op.drop_table('notifications')

    op.drop_index('ix_eligibility_reports_id', table_name='eligibility_reports')
    op.drop_table('eligibility_reports')

    op.drop_index('ix_tender_summaries_id', table_name='tender_summaries')
    op.drop_table('tender_summaries')

    op.drop_index('ix_tender_metadata_tender_id', table_name='tender_metadata')
    op.drop_index('ix_tender_metadata_id', table_name='tender_metadata')
    op.drop_table('tender_metadata')

    op.drop_index('ix_tender_chunks_tender_id', table_name='tender_chunks')
    op.drop_index('ix_tender_chunks_id', table_name='tender_chunks')
    op.drop_table('tender_chunks')

    op.drop_index('ix_tender_documents_tender_id', table_name='tender_documents')
    op.drop_index('ix_tender_documents_id', table_name='tender_documents')
    op.drop_table('tender_documents')

"""add user usage log

Revision ID: 74b1bd06fc45
Revises: 1c7b27b5498e
Create Date: 2025-08-06 10:23:31.934291

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '74b1bd06fc45'
down_revision: Union[str, None] = '1c7b27b5498e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('product_usage_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('usage_start_datetime', sa.Date(), nullable=True),
    sa.Column('usage_end_datetime', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_usage_log_id'), 'product_usage_log', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_product_usage_log_id'), table_name='product_usage_log')
    op.drop_table('product_usage_log')

"""rename stickers association tables

Revision ID: 123456789abc
Revises: 01b805f35e0d
Create Date: 2025-08-19 12:05:00
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '123456789abc'
down_revision: Union[str, None] = '01b805f35e0d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Rename tables to use snake_case with underscore to be consistent with models
    op.rename_table('playerstickers', 'player_stickers')
    op.rename_table('teamstickers', 'team_stickers')

    # Rename indexes accordingly (PostgreSQL specific)
    op.execute("ALTER INDEX IF EXISTS ix_playerstickers_id RENAME TO ix_player_stickers_id")
    op.execute("ALTER INDEX IF EXISTS ix_teamstickers_id RENAME TO ix_team_stickers_id")

def downgrade() -> None:
    # Revert table names back
    op.rename_table('player_stickers', 'playerstickers')
    op.rename_table('team_stickers', 'teamstickers')

    op.execute("ALTER INDEX IF EXISTS ix_player_stickers_id RENAME TO ix_playerstickers_id")
    op.execute("ALTER INDEX IF EXISTS ix_team_stickers_id RENAME TO ix_teamstickers_id")

"""add country

Revision ID: bd180a393be9
Revises: dbcbf0b2ff1a
Create Date: 2025-08-15 12:10:06.892031

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bd180a393be9'
down_revision: Union[str, None] = 'dbcbf0b2ff1a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create countries table and replace player's country column with FK."""

    # 1. Countries table
    op.create_table(
        "countries",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("iso_code", sa.String(), nullable=False),
    )
    op.create_index(op.f("ix_countries_id"), "countries", ["id"], unique=False)

    # 2. Replace old textual column with numeric FK (data is intentionally discarded)
    op.drop_column("player", "country")
    op.add_column("player", sa.Column("country", sa.BigInteger(), nullable=True))
    op.create_foreign_key(
        "fk_player_country",
        "player",
        "countries",
        ["country"], ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    """Revert player's country back to string and drop countries table."""

    # 1. Drop FK and numeric column
    op.drop_constraint("fk_player_country", "player", type_="foreignkey")
    op.drop_column("player", "country")

    # 2. Restore textual column
    op.add_column("player", sa.Column("country", sa.String(), nullable=True))

    # 3. Drop countries table
    op.drop_index(op.f("ix_countries_id"), table_name="countries")
    op.drop_table("countries")

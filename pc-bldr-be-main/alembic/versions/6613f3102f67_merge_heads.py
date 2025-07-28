"""merge heads

Revision ID: 6613f3102f67
Revises: abc6eae892cd, add_display_name_to_product
Create Date: 2025-07-28 10:44:56.230206

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6613f3102f67'
down_revision: Union[str, None] = ('abc6eae892cd', 'add_display_name_to_product')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

"""attempt 8

Revision ID: 92fd9383acff
Revises: 
Create Date: 2024-10-19 11:00:14.951470

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '92fd9383acff'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('abrordob_markers',
    sa.Column('marker_id', sa.String(length=20), nullable=False),
    sa.Column('colour', sa.String(length=20), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('text', sa.String(length=16383), nullable=False),
    sa.PrimaryKeyConstraint('marker_id')
    )
    op.create_table('team_names',
    sa.Column('team_id', sa.Uuid(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('default_name', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('team_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('team_names')
    op.drop_table('abrordob_markers')
    # ### end Alembic commands ###
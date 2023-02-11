import click
from flask import current_app
from .db_access import get_db,close_db


def init_db():
    db =  get_db()
    with current_app.open_resource('database/Schemas/Collectibles.sql') as f:
       db.executescript(f.read().decode('utf8'))
    with current_app.open_resource('database/Schemas/Collections.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
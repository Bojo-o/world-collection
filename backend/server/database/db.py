import sqlite3

import click
from flask import current_app, g

import json
import collections


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource('database/waypoint_schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(insert_to_db)

@click.command('insert')
@click.argument("name")
@click.argument("lati")
@click.argument("long")
def insert_to_db(name,lati,long):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO waypoints (name, latitude, longitude) VALUES (?, ?, ?)",
            (name,lati,long)
        )
        db.commit()
    except db.IntegrityError:
        click.echo(f'error, somehthing went wrong')
    else:      
        click.echo(f'Insert {name} with: {long}, {lati}')

def insert_to_database(name,lati,long):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO waypoints (name, latitude, longitude) VALUES (?, ?, ?)",
            (name,lati,long)
        )
        db.commit()
    except db.IntegrityError:
        print(f'error, somehthing went wrong')
    else:      
        print(f'Insert {name} with: {long}, {lati}')


def get_all_from_db():
    db = get_db()
    try:
        waypoints = db.execute(
            "SELECT * FROM waypoints",
        ).fetchall()

        list_of_waypoints = []
        for waypoint in waypoints:
            d = collections.OrderedDict()
            d["id"] = waypoint["id"]
            d["name"] = waypoint["name"]
            d["lati"] = waypoint["latitude"]
            d["long"] = waypoint["longitude"]
            list_of_waypoints.append(d)
            
        return json.dumps(list_of_waypoints)
        #return waypoints
    except db.IntegrityError:
        print(f'error, somehthing went wrong')     
        
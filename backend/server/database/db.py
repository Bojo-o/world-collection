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
    with current_app.open_resource('database/Collectibles_data_schemas/Collectibles_schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    with current_app.open_resource('database/Collectibles_data_schemas/Collections_schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    
    
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


def insert_Collection_to_database(name : str):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO Collections (name) VALUES (?)",
            (name,)
        )
        db.commit()
    except db.IntegrityError:
        print(f'error, somehthing went wrong')
        return "error"
    else:      
        print(f'Insert {name} to Collections table')
        return "success"



def insert_Collectible_to_database(qNumber : str,collectionID : str,name : str,type : str,latitude : float,longitude : float):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO Collectibles (qNumber,collection,name,type,latitude,longitude) VALUES (?,?,?,?,?,?)",
            (qNumber,collectionID,name,type,latitude,longitude)
        )
        db.commit()
    except db.IntegrityError:
        print(f'error, somehthing went wrong')
        return 'error'
    else:      
        print(f'Insert {name} to Collectibles table')
        return 'success'

def get_collectionID(collection_name : str):
    db=get_db()
    try:
        query = "SELECT * FROM Collections WHERE name='{0}'".format(collection_name)
        collection = db.execute(query).fetchone()
        return collection["collectionID"]

    except db.IntegrityError:
        print(f'error, somehthing went wrong')
        return 'error'  

def get_collections_from_db():
    db=get_db()
    try:
        existing_collections = db.execute("SELECT * FROM Collections").fetchall()

        list_of_collections = []
        for collection in existing_collections:
            d = collections.OrderedDict()
            d["collectionID"] = collection["collectionID"]
            d["name"] = collection["name"]
            list_of_collections.append(d)
        return json.dumps(list_of_collections)

    except db.IntegrityError:
        print(f'error, somehthing went wrong')  

def get_all_collectibles_in_collection(collectionID : int):
    db = get_db()
    try:
        query = "SELECT * FROM Collectibles WHERE collection={0}".format(collectionID)
        existing_collectibles = db.execute(query).fetchall()

        list_of_collectibles = []
        for collectible in existing_collectibles:
            d = collections.OrderedDict()
            d["QNumber"] = collectible["qNumber"]
            d["collectionID"] = collectible["collection"]
            d["name"] = collectible["name"]
            d["type"] = collectible["type"]
            d["latitude"] = collectible["latitude"]
            d["longitude"] = collectible["longitude"]
            list_of_collectibles.append(d)
        return json.dumps(list_of_collectibles)
    except db.IntegrityError:
        print(f'error, somehthing went wrong')  

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
        
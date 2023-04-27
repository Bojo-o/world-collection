import json
import collections

from .db_access import get_db


def execute_command(sql: str, parameters:  any):
    """
    Execute sql command in Database.

    Parameters
    ----------
    sql : str
        Command, which will be executed.
    parameters : any
        Parameters for command.

    Returns
    -------
    bool
        True if command was executed and there was not Integrity Error.
    """
    db = get_db()
    try:
        db.execute(sql, parameters)
        db.commit()
    except db.IntegrityError:
        print(
            f'Database Integrity Error, problem with executing, command :{sql} with parameters: {parameters}')
        return False
    else:
        return True


def execute_and_fetch_all(sql: str, parameters: any):
    """
    Fetch all rows from Database, which satisfying provided sql command.

    Parameters
    ----------
    sql : str
        Command, which fetch all rows.
    parameters : any
        Parameters for command.

    Returns
    -------
    JSON formatted str
        Json with array of data.

    None
        If Integrity Error occurs.
    """
    db = get_db()
    try:
        fetched_rows = db.execute(sql, parameters).fetchall()
        data = []
        for row in fetched_rows:
            d = collections.OrderedDict()
            keys = row.keys()
            for key in keys:
                d[key] = row[key]
            data.append(d)
        return json.dumps(data, default=str)
    except db.IntegrityError:
        print(
            f'Database Integrity Error, problem with fetching all, command :{sql} with parameters: {parameters}')
        return None


def execute_and_fetch_one(sql: str, parameters: any):
    """
    Fetch one row from Database, which satisfying provided sql command.

    Parameters
    ----------
    sql : str
        Command, which fetch one row.
    parameters : any
        Parameters for command.

    Returns
    -------
    JSON formatted str
        Fetched data.

    None
        If Integrity Error occurs.
    """
    db = get_db()
    try:
        row = db.execute(sql, parameters).fetchone()
        d = collections.OrderedDict()
        keys = row.keys()
        for key in keys:
            d[key] = row[key]
        return json.dumps(d, default=str)
    except db.IntegrityError:
        print(
            f'Database Integrity Error, problem with fetching one, command :{sql} with parameters: {parameters}')
        return None


def execute_and_ask(sql: str, parameters: any):
    """
    Ask Database.

    Parameters
    ----------
    sql : str
        Command, which asks Database for result.
    parameters : any
        Parameters for command.

    Returns
    -------
    JSON formatted str
        Result of asking.

    None
        If Integrity Error occurs.
    """
    db = get_db()
    try:
        row = db.execute(sql, parameters).fetchone()
        d = collections.OrderedDict()
        key = row.keys()[0]
        d['result'] = row[key]
        return json.dumps(d, default=str)
    except db.IntegrityError:
        print(
            f'Database Integrity Error, problem with asking, command :{sql} with parameters: {parameters}')
        return None

# CRUD for collections


def create_collection(name_of_collection: str):
    """
    Create a new collection in database table.

    Parameters
    ----------
    name_of_collection : str
        Name of collection.

    Returns
    -------
    bool
        True if operation was successful.
    """
    status = execute_command(
        "INSERT INTO Collections (name) VALUES (?)", (name_of_collection,))
    if status is True:
        print(
            f'Create collection {name_of_collection} and insert into Collections table')
    return status


def delete_collection(collection_id: int):
    """
    Delete a existing collection from database table.

    Parameters
    ----------
    collection_id : int
        ID of collection, which will be deleted.

    Returns
    -------
    bool
        True if operation was successful.
    """
    status = execute_command(
        "DELETE FROM Collections WHERE collection_id=?", (collection_id,))
    if status is True:
        print(
            f'Delete collection with ID: {collection_id} from Collections table')
    return status


def update_collection(collection_id: int, new_name_of_collection: str):
    """
    Rename a existing collection.

    Parameters
    ----------
    collection_id : int
        ID of collection, which name will be changed.
    new_name_of_collection : str
        A new name of collection.

    Returns
    -------
    bool
        True if operation was successful.
    """
    status = execute_command(
        "UPDATE Collections SET name=? WHERE collection_id=?", (new_name_of_collection, collection_id,))
    if status is True:
        print(
            f'Update collection ID: {collection_id},the new name of collection is {new_name_of_collection}')
    return status


def get_all_collections():
    """
    Get all existing collections.

    Returns
    -------
    JSON formatted str
        Data containing collections.
    None
        If there was problem with obtaining collections from database.
    """
    data = execute_and_fetch_all("SELECT * FROM Collections", ())
    return data


def get_collection_status(collection_id: int):
    """
    Get status of collections.
    Status contains how many collectibles in collections have already been visited.

    Parameters
    ----------
    collection_id : int
        ID of collection.

    Returns
    -------
    JSON formatted str
        Status data.

    None
        If there was problem with obtaining data.
    """
    query = "SELECT COUNT(name) FROM Collectibles WHERE collection_id=? AND is_visited=?"
    visited = execute_and_fetch_one(query, (collection_id, 1))
    not_visited = execute_and_fetch_one(query, (collection_id, 0))

    if visited is None or not_visited is None:
        return None

    d = collections.OrderedDict()
    d['visited'] = json.loads(visited)['COUNT(name)']
    d['notVisited'] = json.loads(not_visited)['COUNT(name)']
    return json.dumps(d)


def exists_collection_with_name(name_of_collection: str):
    """
    Ask the database if this name has already used.

    Parameters
    ----------
    name_of_collection : str
        Name, which tests if there exists collection with that name.

    Returns
    -------
    JSON formatted str
        Data contains true or false.

    None
        If there was problem with asking the database.
    """
    ask = "SELECT EXISTS(SELECT * FROM Collections WHERE name=?)"
    data = execute_and_ask(ask, (name_of_collection,))
    if data is None:
        print(f'Error with asking the database, ask command: {ask}')
    return data


# CRUD for collectibles


def create_collectible(q_number: str, collection_id: str, name: str, instance_of: str, latitude: float, longitude: float):
    """
    Create a new collectible, which will be register into provided collection.

    Parameters
    ----------
    q_number : str
        QNumber of collectible.
    collection_id : str
        ID of collection, into which will be collectible added.
    name : str
        Name of collectible.
    instance_of : str
        Info about what sub types is collectible, for example if collectible is instance of castle or cave.
    latitude : float
        Latitude of collectible.
    longitude : float
        Longitude of collectible.

    Returns
    -------
    bool
        True if collectible was created.
    """
    status = execute_command("INSERT INTO Collectibles (q_number,collection_id,name,instance_of,latitude,longitude) VALUES (?,?,?,?,?,?)",
                            (q_number, collection_id, name, instance_of, latitude, longitude,))
    if status is True:
        print(f'Create {name} and inserts into database')
    return status


def delete_collectible(q_number: int, collection_id: int):
    """
    Delete collectible from collection.

    Parameters
    ----------
    q_number : int 
        QNumber of collectible, which will be deleted.
    collection_id : int
        Collection ID, from which will be collectible with provided QNumber deleted.

    Returns
    -------
    bool
        True if collectible was deleted.
    """
    status = execute_command(
        "DELETE FROM Collectibles WHERE q_number=? AND collection_id=?", (q_number, collection_id,))
    if status is True:
        print(
            f'Delete collectible with Q number :{q_number} in collection with id : {collection_id}')
    return status


def get_all_collectibles_in_collection(collection_id: int):
    """
    Get data about all collectibles, which belong to provided collection.

    Parameters
    ----------
    collection_id : int
        Collection ID, from which data is collected.

    Returns
    -------
    JSON formatted str
        Json with array of data containing collectibles.
    None 
        If fetching is not successful.
    """
    data = execute_and_fetch_all(
        "SELECT * FROM Collectibles WHERE collection_id=?", (collection_id,))
    if data is None:
        print(
            f'Error with obtaining all collectibles in collection with ID : {collection_id}')
    return data


def update_collectible_name(q_number: int, new_name: str):
    """
    Change name of existing collectible for a new one.

    Parameters
    ----------
    q_number : int
        QNUmber identifying the existing collectible.
    new_name : str
        A new name, which will replace old one.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command(
        "UPDATE Collectibles SET name=? WHERE q_number=?", (new_name, q_number,))
    if status is True:
        print(f'Update name of collectible with Q number : {q_number}')
    return status


def update_collectible_collection(q_number: int, collection_id: int, new_collection_id: int):
    """
    Change name of existing collectible for a new one.

    Parameters
    ----------
    q_number : int
        QNUmber identifying the existing collectible.
    collection_id : int
        Collection ID, in which collectible exists.
    new_collection_id : int
        Collection ID of collection, into which will be collectible moved.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command("UPDATE Collectibles SET collection_id=? WHERE q_number=? AND collection_id=?",
                            (new_collection_id, q_number, collection_id,))
    if status is True:
        print(
            f'Update collection of collectible with Q number : {q_number} , which was in collection with id : {collection_id}')
    return status


def update_collectible_visit(q_number: int, is_visited: int):
    """
    Set collectible visitation. It only change visit property of collectible.
    For setting date of visit use other func.

    Parameters
    ----------
    q_number : int
        QNUmber identifying the existing collectible.
    is_visited : int
        Value representing a new value of collectibles visit property.
        Use "1" for true or "0" for false.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command(
        "UPDATE Collectibles SET is_visited=?  WHERE q_number=?", (is_visited, q_number))
    if status is True:
        print(f'Update visit of the collectible with Q number : {q_number}')
    return status


def update_collectible_visit_date(q_number: int, date_format: str = None, date_from: str = None, date_to: str = None):
    """
    Set collectible date of visit. 

    Parameters
    ----------
    q_number : int
        QNUmber identifying the existing collectible.
    date_format : str
        Date precision, it helps fronted to render date.
        Supported precision for fronted are : "Day","Month","Year"
    date_from: str 
        String representation of date from.
    date_to : str 
        String representation of date to.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command("UPDATE Collectibles SET visit_date_from=?, visit_date_to=?, visit_date_format=?  WHERE q_number=?",
                            (date_from, date_to, date_format, q_number))
    if status is True:
        print(
            f'Update date of visit of the collectible with Q number : {q_number}')
    return status


def update_collectible_icon(q_number: int, icon_name: str):
    """
    Set collectible icon. 
    Collectible "Icon" property stores only name of icon image. Icon image is on the fronted side and fronted use this name to render collectible icon.

    Parameters
    ----------
    q_number : int
        QNUmber identifying the existing collectible.
    icon_name : str
        Name of icon image.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command(
        "UPDATE Collectibles SET icon=?  WHERE q_number=?", (icon_name, q_number))
    if status is True:
        print(f'Update icon of the collectible with Q number : {q_number}')
    return status


def update_collectibles_in_collection_icon(collection_id: int, icon_name: str):
    """
    Set collectible icon for all collectibles in specific collection. 
    Collectible "Icon" property stores only name of icon image. Icon image is on the fronted side and fronted use this name to render collectible icon.

    Parameters
    ----------
    collection_id : int
        Collection ID identifying the existing collection.
    icon_name : str
        Name of icon image.
    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command(
        "UPDATE Collectibles SET icon=?  WHERE collection_id=?", (icon_name, collection_id))
    if status is True:
        print(
            f'Update icons of all collectibles in collection with ID : {collection_id}')
    return status


def update_collectible_notes(q_number: int, new_notes: str):
    """
    Set collectible note property.
    This property stores string data of notes, which user provides for this collectible.

    Parameters
    ----------
    q_number : int
        Collectible QNUmber identifying the existing collectible.
    new_notes : str
        Notes , which will be setted for provided collectible.

    Returns
    -------
    bool 
        True if process was successful.
    """
    status = execute_command(
        "UPDATE Collectibles SET notes=?  WHERE q_number=?", (new_notes, q_number))
    if status is True:
        print(f'Update notes of the collectible with Q number : {q_number}')
    return status

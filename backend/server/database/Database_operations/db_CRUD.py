import click
import json
import collections

from db_access import get_db

def execute_command(sql : str,parameter :  any):
    db = get_db()
    try:
        db.execute(sql,parameter)
        db.commit()
    except db.IntegrityError:
        print(f'error, something went wrong')
        return False
    else:      
        return True

def execute_and_fetch_all(sql: str,parameter : any):
    db=get_db()
    try:
        fetched_rows = db.execute(sql,parameter).fetchall()
        data = []
        for row in fetched_rows:
            d = collections.OrderedDict()
            keys = row.keys()
            for key in keys:
                d[key] = row[key]

            data.append(d)
        return json.dumps(data)
    except db.IntegrityError:
        print(f'error, something went wrong')  
        return None

# collections

# create

def create_collection(name_of_collection : str):
    status = execute_command("INSERT INTO Collections (name) VALUES (?)", (name_of_collection,))
    if status is True:
        print(f'Creates {name_of_collection} and insert into Collections table')
    return status
    
# delete

def delete_collection(id_of_collection : int):
    status = execute_command("DELETE FROM Collections WHERE collection_id=?", (id_of_collection,))
    if status is True:
        print(f'Deletes collection ID: {id_of_collection} from Collections table')
    return status
    
# update

def update_collection(id_of_collection : int,new_name_of_collection : str):
    status = execute_command("UPDATE Collections SET name=? WHERE collection_id=?", (new_name_of_collection,id_of_collection,))
    if status is True:
        print(f'Updates collection ID: {id_of_collection},the new name of collection is {new_name_of_collection}')
    return status
    
# read 

def get_all_collections():
    data = execute_and_fetch_all("SELECT * FROM Collections",())
    if data is None:
        print(f'error, something went wrong') 
    return data
    
#
def get_collection_id(collection_name : str):
    db=get_db()
    try:
        query = "SELECT * FROM Collections WHERE name='{0}'".format(collection_name)
        collection = db.execute(query).fetchone()
        return collection["collection_id"]

    except db.IntegrityError:
        print(f'error, something went wrong')
        return 'error'  
#

# collectibles

# create

def create_collectible(q_number : str,collection_id : str,name : str,instance_of : str,latitude : float,longitude : float):
    status = execute_command("INSERT INTO Collectibles (q_number,collection_id,name,instance_of,latitude,longitude) VALUES (?,?,?,?,?,?)", (q_number,collection_id,name,instance_of,latitude,longitude,))
    if status is True:
        print(f'Creates {name} and inserts into Collectibles table')
    return status
    
# delete

def delete_collectible(q_number : int, collection_id : int):
    status = execute_command("DELETE FROM Collectibles WHERE q_number=? AND collection_id=?",(q_number,collection_id,))
    if status is True:
        print(f'Deletes collectible with Q number :{q_number} in collection with id : {collection_id}')
    return status

# read

def get_all_collectibles_in_collection(collection_id : int):
    data = execute_and_fetch_all("SELECT * FROM Collectibles WHERE collection_id=?"(collection_id,))
    if data is None:
        print(f'error, something went wrong') 
    return data

# update

# name 
def update_collectible_name(q_number : int,new_name : str):
    status = execute_command("UPDATE Collectibles SET name=? WHERE q_number=?",(new_name,q_number,))
    if status is True:
        print(f'Update name of collectible with Q number : Q{q_number}')
    return status

# collection
def update_collectible_collection(q_number : int,collection_id : int,new_collection_id : int):
    status = execute_command("UPDATE Collectibles SET collection_id=? WHERE q_number=? AND collection_id=?",(new_collection_id,q_number,collection_id,))
    if status is True:
        print(f'Update collection of collectible with Q number : Q{q_number} , which was in collection with id : {collection_id}')
    return status

# visit, date 
def update_collectible_visit(q_number : int, is_visited : bool, date: str = None) :
    date_of_visit = "NULL" if date is None else date
    status = execute_command("UPDATE Collectibles SET is_visited=?, date_of_visit=?  WHERE q_number=?",(is_visited,date_of_visit,q_number,))
    if status is True:
        print(f'Update visit of the collectible with Q number : Q{q_number}')
    return status
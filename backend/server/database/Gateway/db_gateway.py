from flask import (
    Blueprint,request
)

import json

from ..Database_operations import db_CRUD

bp_database_gateway = Blueprint('DatabaseGateway', __name__, url_prefix='/DatabaseGateway')


@bp_database_gateway.route('/get/collections', methods=['GET'])
def get_collections():
    """
    Obtain data of all collections in database.

    Returns
    -------
    JSON formatted str
        Json with array of data containing collectibles.
    None
        If fetching was not successful.
    """
    collections = db_CRUD.get_all_collections()
    if collections is None:
        return "Error, there occurs some problem with getting collections from database"
    
    data = json.loads(collections) 
    i = 0
    for collection in data:
        collection_id = collection['collection_id']
        status = json.loads(db_CRUD.get_collection_status(collection_id))
        data[i]['visited'] = status['visited']
        data[i]['notVisited'] = status['notVisited']
        i+=1
    return json.dumps(data)

@bp_database_gateway.route('/get/collectibles',methods=['GET'])
def get_collectibles_in_collection():
    """
    Obtain data of all collectibles in specific collection.

    Necessary Parameters in request
    ----------
    collectionID : str
        ID of collection, from which we want to obtain collectibles.

    Returns
    -------
    JSON formatted str
        Json with array of data containing collectibles.
    None
        If fetching was not successful.
    """
    collection_id = request.args.get("collectionID")
    
    if collection_id is None:
        return "Invalid request, collectionID=< existing collectionID> must be provided"

    result = db_CRUD.get_all_collectibles_in_collection(collection_id)

    if result is None:
        return "Error, there occurs some problem with getting collectibles from database"
    return result

@bp_database_gateway.route('/get/exists_collections',methods=['GET'])
def exists_collections():
    """
    Ask database if there exists collection with specific name.

    Necessary Parameters in request
    ----------
    name : str
        Name of collection.
    
    Returns
    -------
    bool as str
        true if there exists collection with provided name.
    None
        If asking was not successful.
    """
    collection_name = request.args.get("name")
    if collection_name is None:
        return "Invalid request, name=<name of collection,which will be tested> must be provided"

    result = db_CRUD.exists_collection_with_name(collection_name)

    if result is None:
        return "Error, there occurs some problem with asking of database"
    return result

@bp_database_gateway.route('/post/collection_creation', methods=['POST'])
def create_collection():
    """
    Create a new collection.

    Necessary Parameters in request
    ----------
    collection_name : str
        Name of collection.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()

    collection_name = data['collection_name']
    status = db_CRUD.create_collection(collection_name)

    if status is False:
        return  json.dumps({'status' : "Error, collection was not created"})
    return  json.dumps({'status' : "Succesfully created"})

@bp_database_gateway.route('/post/collectibles', methods=['POST'])
def insert_collectibles_into_collection():
    """
    Create and insert all collectibles into collection.

    Necessary Parameters in request
    ----------
    CollectionID : int
        ID of collection, into which will collectibles stored.
    collectibles : JSON
        JSON data of collectibles.
    Returns
    -------
    JSON formatted str
        Contain status report.
    """

    data = request.get_json()

    collectionID = data['collectionID']
    collectibles = data['collectibles']

    errors = []
    for collectible in collectibles:
        insert_status = db_CRUD.create_collectible(collectible['QNumber'],collectionID,collectible['name'],collectible['subTypeOf'],collectible['lati'],collectible['long'])
        if insert_status is False:
            errors.append(collectible['name'])

    if len(errors) != 0:
        return  json.dumps({'status' : "Error, not saved collectibles :" + ','.join(errors)})

    return  json.dumps({'status' : "Succesfully saved"})

@bp_database_gateway.route('/post/set_visit', methods=['POST'])
def set_visit_of_collectible():
    """
    Update visitation of collectible.
    Set visit property, date of visitation and date format.

    Necessary Parameters in request
    ----------
    QNumber : int
        Collectible QNUmber identifying the existing collectible.
    dateFormat : str
        Precision of date.It helps fronted to stores info how to render date of visit on the fronted side.
        [use "null" to store property as NULL]
    dateFrom : str
        Date as string.
        [use "null" to store property as NULL]
    dateTo : str
        Date as string.
        [use "null" to store property as NULL]
    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    
    is_visit = 0
    visition = data['isVisit']
    if visition:
        is_visit = 1

    date_format = None if data['dateFormat'] == 'null' else data['dateFormat']
    date_from = None if data['dateFrom'] == 'null' else data['dateFrom'] 
    date_to = None if data['dateTo'] == 'null' else data['dateTo']  
    
    status_visit =  db_CRUD.update_collectible_visit(data['QNumber'],is_visit)
    status_date =  db_CRUD.update_collectible_visit_date(data['QNumber'],date_format,date_from,date_to)
    
    if status_date and status_visit:
        return  json.dumps({'status' : "Succesfully saved"})

    return json.dumps({'status' : "Error, visitation was not updated"})

@bp_database_gateway.route('/post/collection_update_rename',methods=['POST'])
def update_collection():
    """
    Update collection name.

    Necessary Parameters in request
    ----------
    CollectionID : int
        ID of collection.
    newName : str
        A new name of collection.
    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    
    status = db_CRUD.update_collection(data['CollectionID'],data['newName'])

    if status:
        return  json.dumps({'status' : "Succesfully saved"})
    
    return  json.dumps({'status' : "Error, collection name was not updated"})

@bp_database_gateway.route('/post/collection_update_merge',methods=['POST'])
def merge_collection():
    """
    Merge one collection into other.

    Necessary Parameters in request
    ----------
    CollectionID : int
        ID of collection, from which will collectibles moved to other collection.
    NewCollectionID : int
        ID of collection, into which will collectibles moved.
    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()

    if data['CollectionID'] == data['NewCollectionID']:
        json.dumps({'status' : "Provided collections are the same ones"})

    collectibles = json.loads(db_CRUD.get_all_collectibles_in_collection(data['CollectionID']))
    for collectible in collectibles:
        db_CRUD.update_collectible_collection(collectible['q_number'],data['CollectionID'],data['NewCollectionID'])
    
    status = db_CRUD.delete_collection(data['CollectionID'])
    if status:
        return  json.dumps({'status' : "Collections were succesfully merged"})
    
    return  json.dumps({'status' : "Error, collections were not merged"})

@bp_database_gateway.route('/post/collection_update_delete',methods=['POST'])
def delete_collection():
    """
    Delete collection from database.

    Necessary Parameters in request
    ----------
    CollectionID : int
        ID of collection, which will be deleted.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    
    status = db_CRUD.delete_collection(data['CollectionID'])

    if status:
        return  json.dumps({'status' : "Succesfully deleted"})
    
    return  json.dumps({'status' : "Error, collection was not deleted"})

@bp_database_gateway.route('/post/collectible_delete',methods=['POST'])
def delete_collectible():
    """
    Remove collectible from collection.

    Necessary Parameters in request
    ----------
    q_number : int
        Collectible QNUmber identifying the existing collectible.
    CollectionID : int
        ID of collection, from which will be collectible removed.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    status = db_CRUD.delete_collectible(data['q_number'],data['CollectionID'])

    if status:
        return  json.dumps({'status' : "Succesfully deleted"})
    
    return  json.dumps({'status' : "Error, collectible was not deleted"})

@bp_database_gateway.route('/post/collectible_update_name',methods=['POST'])
def update_collectible_name():
    """
    Update collectible name property .

    Necessary Parameters in request
    ----------
    q_number : int
        Collectible QNUmber identifying the existing collectible.
    name : str
        A new name for collectible.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    status = db_CRUD.update_collectible_name(data['q_number'],data['name'])

    if status:
        return  json.dumps({'status' : "Succesfully saved"})
    
    return  json.dumps({'status' : "Error, name was not updated"})

@bp_database_gateway.route('/post/collectible_update_icon',methods=['POST'])
def update_collectible_icon():
    """
    Update collectible icon property of collectible.

    Necessary Parameters in request
    ----------
    q_number : int
        Collectible QNUmber identifying the existing collectible.
    icon : str
        Name of icon image.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    status = db_CRUD.update_collectible_icon(data['q_number'],data['icon'])


    if status:
        return  json.dumps({'status' : "Succesfully saved"})
    
    return  json.dumps({'status' : "Error, icon was not updated"})

@bp_database_gateway.route('/post/collectibles_in_collection_update_icons',methods=['POST'])
def update_collectibles_icons_in_collection():
    """
    Update collectible icon property for all collectibles in specific collection.

    Necessary Parameters in request
    ----------
    collectionID : int
        Collection ID identifying the existing collection.
    icon : str
        Name of icon image.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    status = db_CRUD.update_collectibles_in_collection_icon(data['collectionID'],data['icon'])

    if status:
        return  json.dumps({'status' : "Succesfully saved"})    
    return  json.dumps({'status' : "Error, some icons were not updated"})

@bp_database_gateway.route('/post/collectible_update_notes',methods=['POST'])
def update_collectible_notes():
    """
    Update collectible notes property in database.

    Necessary Parameters in request
    ----------
    q_number : int
        Collectible QNUmber identifying the existing collectible.
    notes : str
        Notes, which will be setted for provided collectible.

    Returns
    -------
    JSON formatted str
        Contain status report.
    """
    data = request.get_json()
    status = db_CRUD.update_collectible_notes(data['q_number'],data['notes'])

    if status:
        return  json.dumps({'status' : "Succesfully saved"})
    
    return  json.dumps({'status' : "Error, notes were not updated"})
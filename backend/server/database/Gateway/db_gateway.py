from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

import json

from ..Database_operations import db_CRUD

bp_database_gateway = Blueprint('DatabaseGateway', __name__, url_prefix='/DatabaseGateway')

# read / get

@bp_database_gateway.route('/get/collections', methods=['GET'])
def get_collections():
    data = json.loads(db_CRUD.get_all_collections()) 
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
    collection_id = request.args.get("collectionID")
    
    if collection_id is None:
        return "Invalid request, collectionID=< existing collectionID> must be provided"

    return db_CRUD.get_all_collectibles_in_collection(collection_id)

@bp_database_gateway.route('/get/exists_collections',methods=['GET'])
def exists_collections():
    collection_name = request.args.get("name")
    if collection_name is None:
        return "Invalid request, name=<name of collection,which will be tested> must be provided"

    result = db_CRUD.exist_collection_with_name(collection_name)
    return result

# post 
@bp_database_gateway.route('/post/collection_creation', methods=['POST'])
def create_collection():
    data = request.get_json()

    collection_name = data['collection_name']
    status = db_CRUD.create_collection(collection_name)
    if status is False:
        return  json.dumps({'status' : "Error, collection did not saved"})
    return  json.dumps({'status' : "Succesfully saved"})

@bp_database_gateway.route('/post/collectibles', methods=['POST'])
def insert_collection_with_collectibles_to_db():

    data = request.get_json()
    print(data)

    collectionID = data['collectionID']
    collectibles = data['collectibles']
    #status = db_CRUD.create_collection(collection)
    #if status is False:
    #    return "collection did not saved, there was some problem"
    #collectionID = db_CRUD.get_collection_id(collection)

    errors = []
    for collectible in collectibles:
        insert_status = db_CRUD.create_collectible(collectible['QNumber'],collectionID,collectible['name'],collectible['subTypeOf'],collectible['lati'],collectible['long'])
        if insert_status is False:
            errors.append(collectible['name'])

    if len(errors) != 0:
        return  json.dumps({'status' : "Error , not saved :" + ','.join(errors)})

    return  json.dumps({'status' : "Succesfully saved"})

@bp_database_gateway.route('/post/set_visit', methods=['POST'])
def set_visit_of_collectible():

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
        return "Succesfully saved"

    
    return "Something went wrong"

@bp_database_gateway.route('/post/collection_update_rename',methods=['POST'])
def update_collection():

    data = request.get_json()
    
    status = db_CRUD.update_collection(data['CollectionID'],data['newName'])

    if status:
        return "Succesfully saved"
    return "Something went wrong"

@bp_database_gateway.route('/post/collection_update_delete',methods=['POST'])
def remove_collection():

    data = request.get_json()
    
    status = db_CRUD.delete_collection(data['CollectionID'])

    if status:
        return "Succesfully saved"

    
    return "Something went wrong"

@bp_database_gateway.route('/post/collection_update_merge',methods=['POST'])
def merge_collection():

    data = request.get_json()
    if data['CollectionID'] == data['NewCollectionID']:
        return "Same"
    collectibles = json.loads(db_CRUD.get_all_collectibles_in_collection(data['CollectionID']))
    for collectible in collectibles:
        db_CRUD.update_collectible_collection(collectible['q_number'],data['CollectionID'],data['NewCollectionID'])
    
    db_CRUD.delete_collection(data['CollectionID'])
    return "Merged"

@bp_database_gateway.route('/post/collectible_delete',methods=['POST'])
def delete_collectible():

    data = request.get_json()
    status = db_CRUD.delete_collectible(data['q_number'],data['CollectionID'])

    if status:
        return "Succesfully deleted collectible"
    return "Something went wrong"

@bp_database_gateway.route('/post/collectible_update_name',methods=['POST'])
def update_collectible_name():

    data = request.get_json()
    status = db_CRUD.update_collectible_name(data['q_number'],data['name'])

    if status:
        return "Succesfully updated"
    return "Something went wrong"
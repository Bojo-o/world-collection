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

# post 

@bp_database_gateway.route('/post/collectibles', methods=['POST'])
def insert_collection_with_collectibles_to_db():
    req_data = request.get_json()
    collection = req_data['title'].removeprefix("Insert collectibles into: ")
    collectibles = json.loads(req_data['body'])

    status = db_CRUD.create_collection(collection)
    if status is False:
        return "collection did not saved, there was some problem"
    collectionID = db_CRUD.get_collection_id(collection)

    errors = []
    for collectible in collectibles:
        insert_status = db_CRUD.create_collectible(collectible['QNumber'],collectionID,collectible['name'],collectible['instanceOf'],collectible['lati'],collectible['long'])
        if insert_status is False:
            errors.append('Error with ' +  collectible['QNumber'])

    if len(errors) != 0:
        return ''.join(errors)

    return "Succesfully saved"

@bp_database_gateway.route('/post/set_visit', methods=['POST'])
def set_visit_of_collectible():
    req_data = request.get_json()
    data = json.loads(req_data['body'])
    
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
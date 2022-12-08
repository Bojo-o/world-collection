from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

import json

from .db import get_collections_from_db,get_all_collectibles_in_collection,insert_Collection_to_database,insert_Collectible_to_database,get_collectionID

bp_db_gateway = Blueprint('DatabaseAPI', __name__, url_prefix='/DatabaseAPI')


@bp_db_gateway.route('/get/collections', methods=['GET'])
def get_collections():
    return get_collections_from_db()

@bp_db_gateway.route('/get/collectibles',methods=['GET'])
def get_collecibles_in_collection():
    collectionID = request.args.get("collectionID")

    if collectionID is None:
        return "Invalid request, collectionID=< existing collectionID> must be provided"

    return get_all_collectibles_in_collection(collectionID)

@bp_db_gateway.route('/post/collectibles', methods=['POST'])
def insert_collection_to_db():
    req_data = request.get_json()
    collection = req_data['title'].removeprefix("Insert collectibles into: ")
    collectibles = json.loads(req_data['body'])

    status = insert_Collection_to_database(collection)
    if status is "error":
        return "collection did not saved, there was some problem"
    collectionID = get_collectionID(collection)

    errors = []
    for collectible in collectibles:
        insert_status = insert_Collectible_to_database(collectible['QNumber'],collectionID,collectible['name'],collectible['instanceOf'],collectible['lati'],collectible['long'])
        if insert_status is 'error':
            errors.append('Error with ' +  collectible['QNumber'])

    if len(errors) != 0:
        return ''.join(errors)

    return "Succesfully saved"
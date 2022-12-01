import functools

from . import query


from ..database.db import insert_to_database
from .SearchQuery import SearchQueryBuilder

from .Query.wikiDataQuery import WikiDataQueryBuilder

from . import Formater

from .ItemDetail.wikipediaLink import WikiPediaLinkQuery
from .ItemDetail.entityDetailsQueryBuilder import EntityDetailsQueryBuilder

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

bp = Blueprint('API', __name__, url_prefix='/API')

# endpoint url to wikidata sparql
endpoint_url = "https://query.wikidata.org/sparql"

# search satisfying class
@bp.route('/search/classes', methods=['GET'])
def search_class():
    word = request.args.get("word")
    if word is not None:

        builder = SearchQueryBuilder.SearchQueryBuilder(word)
        builder.set_parent_class("wd:Q2221906") # geographic location
        queryText = builder.build()
        print(queryText)
        result = query.get_query_results(endpoint_url,queryText)
        return Formater.formatToJson(result)
    
    return "Invalid request"

@bp.route('/search/administrative_area', methods=['GET'])
def search_instance_administrative_area():
    word = request.args.get("word")
    if word is not None:

        builder = SearchQueryBuilder.SearchQueryBuilder(word)
        builder.set_parent_class("wd:Q56061") # administrative territorial entity 
        builder.set_minus_parent_class("wd:Q15642566") # non-political administrative territorial entity
        builder.set_searing_for_instances()
        queryText = builder.build()
        #print(queryText)
        result = query.get_query_results(endpoint_url,queryText)
        return Formater.formatToJson(result)
    return "Invalid request"

@bp.route('/wikidata/query', methods=['GET'])
def get_results_from_wikidata():    
    classes = request.args.get("classes")
    minus_classes = request.args.get("minus_classes")
    locations = request.args.get("locations")
    minus_locations = request.args.get("minus_locations")

    if classes is not None and locations is not None:
        classes = classes.split(",")
        locations = locations.split(",")

        builder = WikiDataQueryBuilder(classes.pop(0))

        if len(classes) != 0:
            for item in classes:
                builder.add_child_of_class(item)

        if minus_classes is not None:
            minus_classes = minus_classes.split(",")
            for item in minus_classes:
                builder.add_minus_child_of_class(item)
        for item in locations:
            builder.add_location(item)

        if minus_locations is not None:
            minus_locations = minus_locations.split(",")
            for item in minus_locations:
                builder.add_minus_location(item)
        
        queryText = builder.build()
        try:
            result = query.get_query_results(endpoint_url,queryText)
            return Formater.formatToJson(result)
        except:
            return "Query failed"
        

    return "Invalid request"


@bp.route('/wikidata/detail/link_to_wikipedia' , methods=['GET'])
def get_wikipedia_link():
    entity = request.args.get("entity")

    if entity is None:
        return "Invalid request, entity=<Qnumber> must be provided"

    queryBuilder = WikiPediaLinkQuery(entity)
    queryText = queryBuilder.build()
    try:
        result = query.get_query_results(endpoint_url,queryText)
        return Formater.toJson(result)
    except:
        return "Query failed"

@bp.route('/wikidata/detail/details' , methods=['GET'])
def get_entity_details():
    entity = request.args.get("entity")

    if entity is None:
        return "Invalid request, entity=<Qnumber> must be provided"
    
    PROPERIES = ["P18","P1448","P131","P571","P2044","P3018","P2046","P2048","P2043","P149","P84","P1329","P968","P856","P17","P1082"]
    # in order 
    queryBuilder = EntityDetailsQueryBuilder(entity)
    for property in PROPERIES:
        queryBuilder.add_property(property)
    queryText = queryBuilder.build()
    print(queryText)
    try:
        result = query.get_query_results(endpoint_url,queryText)
        return Formater.toJson(result)
    except:
        return "Query failed"

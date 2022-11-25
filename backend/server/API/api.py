import functools

from . import query


from ..database.db import insert_to_database
from .SearchQuery import SearchQueryBuilder

from .Query.wikiDataQuery import WikiDataQueryBuilder

from . import Formater

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

@bp.route('/wikidata/query')
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

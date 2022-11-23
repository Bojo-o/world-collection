import functools

from . import query
from .Query.wikiDataQuery import WikiDataQuery

from ..database.db import insert_to_database
from .SearchQuery import SearchQueryBuilder

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
        #print(queryText)
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
        print(queryText)
        result = query.get_query_results(endpoint_url,queryText)
        return Formater.formatToJson(result)
    return "Invalid request"

@bp.route('/wikidata/query')
def get_results_from_wikidata():    

    endpoint_url = "https://query.wikidata.org/sparql"

    write_to_db = request.args.get("database")
    

    query_builder = WikiDataQuery("countries")
    queryText = query_builder.build()
    if queryText is None:
        return "Provided Query is invalid"
    result = query.get_query_results(endpoint_url,queryText)

    if write_to_db is not None:
        if write_to_db == "true":
            print(result)
    return result

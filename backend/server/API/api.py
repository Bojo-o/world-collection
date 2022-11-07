import functools

from . import query
from .Query.wikiDataQuery import WikiDataQuery

from ..database.db import insert_to_database

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/a')
def a():
    return "ahoj"


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

import functools

from . import query

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

endpoint_url = "https://query.wikidata.org/sparql"

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/a')
def a():
    return "ahoj"

queryText = """
SELECT ?item ?itemLabel ?geo
WHERE 
{
  ?item wdt:P31 wd:Q6256.
  ?item wdt:P625 ?geo.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}"""

@bp.route('/states')
def get_countries():    
    return query.get_query_results(endpoint_url,queryText)

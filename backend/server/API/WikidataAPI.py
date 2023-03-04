from .SearchQuery.NEWSearchQueryBuilder import SearchClassesQueryBuilder
from . import SparqlPoint
from . import Formater

from flask import (
    Blueprint,request
)

API = Blueprint('WikidataAPI', __name__, url_prefix='/WikidataAPI')

# endpoint url to wikidata sparql
endpoint_url = "https://query.wikidata.org/sparql"

# constants
SUPER_CLASS : str = "Q2221906" # geographic location

def process_query(query : str):
    try:
        result = SparqlPoint.get_query_results(endpoint_url,query)
        return Formater.convertToJson(result)
    except:
        return "invalid query"

@API.route('/search/classes',methods=['GET'])
def search_for_classes():
    # argumnets 
    searched_word = request.args.get("key_word")
    exceptions_classes = request.args.get("exceptions")

    builder = SearchClassesQueryBuilder()

    if searched_word is not None:
        builder.set_seach_by_word(searched_word)

    builder.add_super_class(SUPER_CLASS)

    if exceptions_classes is not None:
        for item in exceptions_classes.split(','):
            builder.add_exception_class(item)

    return process_query(builder.build())


    

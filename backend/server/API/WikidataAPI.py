from .SearchQuery.NEWSearchQueryBuilder import SearchClassesQueryBuilder, SearchInstancesQueryBuilder
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
ADMINISTRATIVE_AREA : str = "Q56061" # administrative territorial entity
FORMAR_AREA : str = "Q19832712" #historical administrative division
#
NOT_ADMINISTRATIVE_AREA : str = "Q15642566" # non-political administrative territorial entity

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
    super_class = request.args.get("super_class")
    exceptions_classes = request.args.get("exceptions")

    builder = SearchClassesQueryBuilder()

    if searched_word is not None:
        builder.set_seach_by_word(searched_word)

    if super_class is not None:
        builder.add_super_class(super_class)
    else:
        builder.add_super_class(SUPER_CLASS)
    

    if exceptions_classes is not None:
        for item in exceptions_classes.split(','):
            builder.add_exception_class(item)

    return process_query(builder.build())

@API.route('/search/places',methods=['GET'])
def search_for_locations():
    searched_word = request.args.get("key_word")
    if searched_word is None:
        return "Invalid request,param: key_word must be provided"
    
    builder = SearchInstancesQueryBuilder()
    builder.set_seach_by_word(searched_word)
    builder.add_super_class(SUPER_CLASS)
    builder.set_geo_obtaining()
    print(builder.build())
    return process_query(builder.build())

@API.route('/search/administrative_areas',methods=['GET'])
def search_for_administrative_areas():
    searched_word = request.args.get("key_word")
    located_in_area = request.args.get("located_in_area")
    not_located_in_area = request.args.get("not_located_in_area")
    exceptions_classes = request.args.get("exceptions")

    builder = SearchInstancesQueryBuilder()

    if searched_word is not None:
        builder.set_seach_by_word(searched_word)
        builder.set_recursive_searching_for_located_in_area()
    
    builder.add_super_class(ADMINISTRATIVE_AREA)
    builder.add_exception_class(NOT_ADMINISTRATIVE_AREA)
    builder.add_exception_class(FORMAR_AREA)

    if exceptions_classes is not None:
        for item in exceptions_classes.split(','):
            builder.add_exception_class(item)

    if located_in_area is not None:
        builder.add_located_in_area(located_in_area)

    if not_located_in_area is not None:
        for item in not_located_in_area.split(','):
            builder.add_not_located_in_area(item)
            
    print(builder.build())
    return process_query(builder.build())
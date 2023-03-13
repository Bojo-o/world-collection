import collections
import json

from .NEWQuery.CollectiblesQuery.AroundCollectiblesSearchQueryBuilder import AroundCollectiblesSearchQueryBuilder

from .NEWQuery.SearchQuery.SearchByClassRestrictionQueryBuilder import TYPES
from .SearchQuery.NEWSearchQueryBuilder import SearchClassesQueryBuilder, SearchInstancesQueryBuilder
from . import SparqlPoint
from . import Formater
from .NEWQuery.SearchQuery.SearchAreaQueryBuilders import SearchCollectibleTypesQueryBuilder , SearchAreaQueryBuilder
from flask import (
    Blueprint,request
)
from .NEWQuery.FilterQuery.FilterSearchQueryBuilder import FilterSearchQueryBuilder
from .NEWQuery.FilterQuery.FilterDataQueryBuilder import PROPERTY_CONSTRAINT_TYPE, FilterDataQueryBuilder , DATATYPES
from .NEWQuery.SearchQuery.SearchWikibaseItemQueryBuilder import SearchWikibaseItemQueryBuilder

from .NEWQuery.CollectiblesQuery.CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder
from .NEWQuery.CollectiblesQuery.FiltersData.ComparisonOperators import ComparisonOperators

API = Blueprint('WikidataAPI', __name__, url_prefix='/WikidataAPI')

# endpoint url to wikidata sparql
endpoint_url = "https://query.wikidata.org/sparql"

# constants
GEO_LOCATION : str = "Q2221906" # geographic location
ADMINISTRATIVE_AREA : str = "Q56061" # administrative territorial entity
FORMAR_AREA : str = "Q19832712" #historical administrative division
#
NOT_ADMINISTRATIVE_AREA : str = "Q15642566" # non-political administrative territorial entity

def process_query(query : str):
    try:
        result = SparqlPoint.get_query_results(endpoint_url,query)
        return Formater.toJson(result)
    except:
        return "invalid query"

@API.route('/search/classes',methods=['GET'])
def search_for_classes():
    # argumnets 
    searched_word = request.args.get("key_word")
    super_class = request.args.get("super_class")
    exceptions_classes = request.args.get("exceptions")

    builder = SearchCollectibleTypesQueryBuilder()
    
    if searched_word is not None:
        builder.set_seach_by_word(searched_word)

    if super_class is not None:
        builder.add_super_class(super_class)
    else:
        builder.add_super_class(GEO_LOCATION)
    

    if exceptions_classes is not None:
        for item in exceptions_classes.split(','):
            builder.add_exception_class(item)
    #print(builder.build())
    return process_query(builder.build())

@API.route('/search/places',methods=['GET'])
def search_for_locations():
    searched_word = request.args.get("key_word")
    if searched_word is None:
        return "Invalid request,param: key_word must be provided"
    
    builder = SearchAreaQueryBuilder()
    builder.set_seach_by_word(searched_word)
    builder.add_super_class(GEO_LOCATION)
    builder.set_recursive_searching(True)
    builder.set_geo_obtaining()
    #print(builder.build())
    return process_query(builder.build())

@API.route('/search/administrative_areas',methods=['GET'])
def search_for_administrative_areas():
    searched_word = request.args.get("key_word")
    located_in_area = request.args.get("located_in_area")
    not_located_in_area = request.args.get("not_located_in_area")
    exceptions_classes = request.args.get("exceptions")

    builder = SearchAreaQueryBuilder()
    builder.set_recursive_searching(True)
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
            
    #print(builder.build())
    return process_query(builder.build())

@API.route('/get/filters',methods=['GET'])
def get_filters():
    type = request.args.get("type")

    builder = FilterSearchQueryBuilder()
    
    if type is not None:
        builder.set_type_for_search_filter(type)

    #print(builder.build())
    return process_query(builder.build())


@API.route('/get/filter_data',methods=['GET'])
def get_filter_data():
    property = request.args.get('property')
    data_type = request.args.get('data_type')

    if property is None or data_type is None:
        return "Invalid request,params: property and data_type must be provided"
    
    type : DATATYPES = None
    match data_type:
        case "Quantity":
            type = DATATYPES.QUANTITY
        case "Time":
            type = DATATYPES.TIME
        case "WikibaseItem":
            type = DATATYPES.WIKIBASEITEM

    if type is None :
        return "Invalid request, data_type param value-constraints : Quantity, Time or WikibaseItem "
    
    match type:
        case DATATYPES.WIKIBASEITEM:
            d = collections.OrderedDict()

            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.ONE_OF_CONSTRAINT)
            d["one_of_constraint"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.NONE_OF_CONSTRAINT)   
            d["none_of_constraint"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.CONFLICT_WITH_CONSTRAINT)   
            d["conflict_with_constraint"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.VALUE_TYPE_CONSTRAINT)   
            d["value_type_constraint"] = json.loads(process_query(builder.build()))
            print(builder.build())
            
            return json.dumps(d)
        
        case DATATYPES.QUANTITY:
            d = collections.OrderedDict()
            
            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.ALLOWED_UNITS_CONSTRAINT)
            d["units"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(property,type,PROPERTY_CONSTRAINT_TYPE.RANGE_CONSTRAINT)
            d["range"] = json.loads(process_query(builder.build()))
            return  json.dumps(d)
    return "" 

@API.route('/search/wikibase_item',methods=['GET'])
def search_wikibase_item():
    searched_word = request.args.get("key_word")

    if searched_word is None:
        return "Invalid request,param: key_word must be provided"
    
    value_type = request.args.get("value_type")
    value_type_relation = request.args.get("value_type_relation")
    conflict_type = request.args.get("conflict_type")
    conflict_type_relation = request.args.get("conflict_type_relation")
    none_values = request.args.get("none_values")

    
    builder = SearchWikibaseItemQueryBuilder()
    builder.set_recursive_searching(True)
    builder.set_at_least_one_super_class_mandatory(False)
    builder.set_seach_by_word(searched_word)
    builder.set_distinct(True)
    
    if conflict_type_relation is not None:
        builder.reset_type_for_exceptions_classes("wdt:" + conflict_type_relation)
    if value_type_relation is not None:
        match value_type_relation:
            case "instance of":
                builder.reset_type_for_super_classes(TYPES.INSTANCES.value)
            case "subclass of":
                builder.reset_type_for_super_classes(TYPES.CLASS.value)
            case "instance or subclass of":
                builder.reset_type_for_super_classes(TYPES.INSTANCEORCLASS.value)

    if value_type is not None and value_type.__eq__('') == False:
        values = value_type.split(',')
        for value in values:
            builder.add_super_class(value)

    if conflict_type is not None and conflict_type.__eq__('') == False:
        conflict_values = conflict_type.split(',')
        for conflict_value in conflict_values:
            builder.add_exception_class(conflict_value)

    if none_values is not None and none_values.__eq__('') == False:
        none_values = none_values.split(',')
        for none_value in none_values:
            builder.add_none_of_constraint(none_value)
    
    print(builder.build())
    return process_query(builder.build())

@API.route('/search/collectibles',methods=['GET'])
def search_collectibles():
    builder = AroundCollectiblesSearchQueryBuilder("Q515")
    builder.set_radius(100)
    builder.set_distinct(True)
    builder.set_center_as_entity("Q1085")
    builder.add_class_exception("Q17715832")
    #builder.add_item_filter("P149","Q176483")
    #builder.add_time_filter("P571",ComparisonOperators.EQUAL_TO,"900-00-00")
    builder.add_quantity_filter("P2044",ComparisonOperators.LESS_THAN,"0.2","Q828224")
    print(builder.build())
    return ""

import collections
import json

from .WikidataQueries.SearchQueries.SearchCollectibleQueryBuilder import SearchCollectibleQueryBuilder

from .WikidataQueries.CollectiblesSearchQueries.AroundCollectiblesSearchQueryBuilder import AroundCollectiblesSearchQueryBuilder
from .WikidataQueries.CollectiblesSearchQueries.AdministrativeAreaCollectiblesSearchQueryBuilder import AdministrativeAreaCollectiblesSearchQueryBuilder

from .WikidataQueries.SearchQueries.SearchByClassRestrictionQueryBuilder import TYPES
# from .SearchQuery.SearchQueryBuilder import SearchClassesQueryBuilder, SearchInstancesQueryBuilder
from . import SparqlPoint
from . import Formater
from .WikidataQueries.SearchQueries.SearchAreaQueryBuilders import SearchAreaQueryBuilder
from .WikidataQueries.SearchQueries.SearchCollectibleTypesQueryBuilder import SearchCollectibleTypesQueryBuilder
from flask import (
    Blueprint, current_app, request
)
from .WikidataQueries.FilterQueries.FilterSearchQueryBuilder import FilterSearchQueryBuilder
from .WikidataQueries.FilterQueries.FilterDataQueryBuilder import PROPERTY_CONSTRAINT_TYPE, FilterDataQueryBuilder, DATATYPES
from .WikidataQueries.SearchQueries.SearchWikibaseItemQueryBuilder import SearchWikibaseItemQueryBuilder

from .WikidataQueries.CollectiblesSearchQueries.CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder
from .WikidataQueries.CollectiblesSearchQueries.FiltersData.ComparisonOperators import get_ComparisonOperator
from .WikidataQueries.CollectiblesSearchQueries.FiltersData.FilterType import FilterType, get_FilterType
from .WikidataQueries.CollectiblesSearchQueries.CollectiblesSearchType import CollectiblesSearchType, Get_CollectiblesSearchType
from .WikidataQueries.SearchQueries.SearchRegionQueryBuilder import SearchRegionQueryBuilder
from .WikidataQueries.CollectiblesSearchQueries.RegionCollectiblesSearchQueryBuilder import RegionCollectiblesSearchQueryBuilder
from .WikidataQueries.CollectiblesSearchQueries.WorldCollectiblesSearchQueryBuilder import WorldCollectiblesSearchQueryBuilder
from .WikidataQueries.CollectiblesSearchQueries.CollectibleDataGetter import CollectibleDataGetter
from .WikidataQueries.CollectibleDetailsQueries.CollectibleBasicInfoQuery import CollectibleBasicInfoQuery
from .WikidataQueries.CollectibleDetailsQueries.CollectibleDatailsQuery import CollectibleDetailsQuery
from .WikidataQueries.CollectibleDetailsQueries.WikipediaLinkQuery import WikiPediaLinkQuery

# creates API blueprint, into which it will be added all route functions, then added into app
API = Blueprint('WikidataAPI', __name__, url_prefix='/WikidataAPI')

# endpoint url to wikidata sparql
endpoint_url = "https://query.wikidata.org/sparql"

# constants
GEO_LOCATION: str = "Q2221906"  # geographic location
ADMINISTRATIVE_AREA: str = "Q56061"  # administrative territorial entity
FORMAR_AREA: str = "Q19832712"  # historical administrative division
# non-political administrative territorial entity
NOT_ADMINISTRATIVE_AREA: str = "Q15642566"


def process_query(query: str):
    '''
    Function wrapping sending query to endpoint and retriving result from it and converting it into JSON format.

    Parameters
    ---------
    query : str
        String format of the query that we want to send to the Sparq endpoint.

    Return
    ------
    JSON formatted str
        Result of query in JSON formatted str, that result will be transformed by json tranformation, which is implemented in `Formater.py`.
    '''
    try:
        result = SparqlPoint.get_query_results(endpoint_url, query)
        return Formater.toJson(result)
    except:
        return "Invalid query, query is somewhat corrupted"


@API.route('/search/collectible_allowed_types', methods=['GET'])
def search_for_classes():
    '''
    API route function seaching for allowed types of collectible.
    That means it search for all classes, which can be used as `super classes` of collectibles.
    For example collectible might be instance of class `castle` or `city`, but it not make sense for classes such as for example `planet`, `language`.

    Required json parameters
    -----------------------
    search_word : str 
        Entered key word by whose will search process.
    super_class : str [optional]
        QNUmber of class, which restricts searching. That means found results must be sub-class of this `super_class`.
    exception_classes : list[str] [optional] 
        List of QNUmber of classes, which restricts searching. That means found results is not allowed to be sub-class of this `exception_classes`.

    Return
    ------
    JSON formatted str
        Data of found allowed types, which can be used as `super class` for collectible searching.
    '''
    data = json.loads(request.args.get("data"))

    search_word = None
    super_class = None
    exception_classes = []
    try:
        search_word = data["search_word"]
        super_class = data["super_class"]
        exception_classes: list[str] = data["exception_classes"]
    except:
        pass

    builder = SearchCollectibleTypesQueryBuilder(
        super_class, exception_classes)

    if search_word is not None and search_word != "":
        builder.set_searched_word(search_word)
    
    return process_query(builder.build())


@API.route('/search/placesOrCollectibles', methods=['GET'])
def search_for_places_or_collectibles():
    '''
    API route function seaching for places of collectibles.
    Note : Places and Collectibles are the same ones. We only referred to it differently, because we call this route function for searching "places",
    which will be used as center of circle by radius area searching.
    When we want to add a new collectible, we also call this function and then it search for "collectibles"
    Required json parameters
    -----------------------
    search_word : str 
        Entered key word by whose will search process.

    Return
    ------
    JSON formatted str
        Data of found collectibles or places.
    '''
    
    data = json.loads(request.args.get("data"))
    
    #data = json.loads(request.get_json())
    search_word = data["search_word"]

    if search_word is None:
        return "Invalid request, `search_word parameter` must be provided"

    builder = SearchCollectibleQueryBuilder()
    builder.set_searched_word(search_word)

    return process_query(builder.build())


@API.route('/get/collectible_data', methods=['GET'])
def get_collectible_data():
    '''
    API route function, for obtaining data of collectible.
    Note : In case we know only QNumber of collectible, or in this project, there exists case when we do not have complate data about collectible,
    so we call this to obtaning remaining data.

    Required json parameters
    -----------------------
    collectible_QNumber : str 
        QNumber of collectible existing on Wikidata.

    Return
    ------
    JSON formatted str
        Data of collectible.
    '''
    data = json.loads(request.args.get("data"))

    Qnumber = data['collectible_QNumber']
    if Qnumber is None:
        return "Invalid request, param : collectible_QNumber must be provided"

    builder = CollectibleDataGetter()
    builder.set_collectible(Qnumber)

    return process_query(builder.build())


@API.route('/search/regions', methods=['GET'])
def search_regions():
    '''
    API route function, for obtaining list of data of regions.
    Region such as Europe , East Asia.

    Required json parameters
    -----------------------
    search_word : str | None
        Entered key word by whose will search process.
        Note : If this parameter is None, then it search for all regions.

    Return
    ------
    JSON formatted str
        List of all data of found regions.
    '''

    data = json.loads(request.args.get("data"))

    builder = SearchRegionQueryBuilder()

    search_word = data['search_word']
    if search_word is not None:
        builder.set_searched_word(search_word)
    
    return process_query(builder.build())


@API.route('/search/administrative_areas', methods=['GET'])
def search_for_administrative_areas():
    '''
    API route function, for obtaining list of recomended filters/properties from Wikidata.
    Note : By recomended filters it means that filters/properies , which are related with provided type.
    For example if type is class of "City" it makes sense to use filter "population" and not use "lenght", which would be good to use with "cave" as example.

    Required json parameters
    -----------------------
    search_word : str | None
        Entered key word by whose will search process.
        Note : If this parameter is None, then it search for all adminsitative areas.
    located_in_area : str [optional]
        QNumber of administrative area.
        It is used when we want search for administrative area, which lie in this area.
    not_located_in_areas = list[str] [optional]
        List of QNumber of administrative areas.
        It is used when we want search for administrative area, which do not lie in this area.

    Return
    ------
    JSON formatted str
        List of all data of found administrative areas.
    '''
    data = json.loads(request.args.get("data"))

    search_word = data["search_word"]

    located_in_area = None
    not_located_in_areas = []
    try:
        located_in_area = data["located_in_area"]
        not_located_in_areas: list[str] = data["not_located_in_areas"]
    except:
        pass

    builder = SearchAreaQueryBuilder()
    builder.set_recursive_searching(True)
    if search_word != "":
        builder.set_searched_word(search_word)
        builder.set_recursive_searching_for_located_in_area()

    builder.add_super_class(ADMINISTRATIVE_AREA)
    builder.add_exception_class(NOT_ADMINISTRATIVE_AREA)
    builder.add_exception_class(FORMAR_AREA)

    if located_in_area is not None:
        builder.add_located_in_area_resctriction(located_in_area)

    for item in not_located_in_areas:
        builder.add_not_located_in_area_resctriction(item)
   
    return process_query(builder.build())


@API.route('/get/recomended_filters', methods=['GET'])
def get_recomened_filters():
    '''
    API route function, for obtaining list of recomended filters/properties from Wikidata.
    Note : By recomended filters it means that filters/properies , which are related with provided type.
    For example if type is class of "City" it makes sense to use filter "population" and not use "lenght", which would be good to use with "cave" as example.

    Required json parameters
    -----------------------
    type : str | None
        QNumber of class existing on Wikidata, which defines super class of collectibles in searching for collectibles process.
        Because, we want offer filters, which makes sense with this type of collectibles.
        Note : If type is `None`, then it returnl all filters data from static json stored in this server.

    Return
    ------
    JSON formatted str
        List of all recomended filters, which might be used for provided type.
    '''
    data = json.loads(request.args.get("data"))

    type = data["type"]
    builder = FilterSearchQueryBuilder()

    if type is None:
        with current_app.open_resource('Data/AllFilters.json') as file:
            data = json.load(file)
            return json.dumps(data)

    builder.set_type_for_search_filter(type)
   
    return process_query(builder.build())


@API.route('/get/filter_data', methods=['GET'])
def get_filter_data():
    '''
    API route function, for obtaining filter/property data from Wikidata.
    It fetches data such as allowed unit , max and min value for Quantity data properties,
    for WikibaseItem data property it fetched constraints , conflicts types etc..

    Required json parameters
    -----------------------
    property : str
        PNumber of property, from which we want to obtain data.
    data_type : str
        Data type of property as string. 
        Allowed values are "Time","Quantity","WikibaseItem".
        Note : In this project if we call this route function, we already have known property data type, so we provided it then, insted of fetching this information again.

    Return
    ------
    JSON formatted str
        Data of filter/property from Wikidata.
        For each data type of property it return differently data. 
    '''
    data = json.loads(request.args.get("data"))

    property = data['property']
    data_type = data['data_type']

    if property is None or data_type is None:
        return "Invalid request, `property` and `data_type` parameters must be provided"

    type: DATATYPES = None

    try:
        type: DATATYPES = DATATYPES(data_type)
    except:
        return "Invalid request, data_type parameter, allowed values are  Quantity, Time or WikibaseItem "

    match type:
        case DATATYPES.WIKIBASEITEM:
            d = collections.OrderedDict()

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.ONE_OF_CONSTRAINT)
            d["one_of_constraint"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.NONE_OF_CONSTRAINT)
            d["none_of_constraint"] = json.loads(
                process_query(builder.build()))

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.CONFLICT_WITH_CONSTRAINT)
            d["conflict_with_constraint"] = json.loads(
                process_query(builder.build()))

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.VALUE_TYPE_CONSTRAINT)
            d["value_type_constraint"] = json.loads(
                process_query(builder.build()))
            
            return json.dumps(d)

        case DATATYPES.QUANTITY:
            d = collections.OrderedDict()

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.ALLOWED_UNITS_CONSTRAINT)
            d["units"] = json.loads(process_query(builder.build()))

            builder = FilterDataQueryBuilder(
                property, type, PROPERTY_CONSTRAINT_TYPE.RANGE_CONSTRAINT)
            d["range"] = json.loads(process_query(builder.build()))
            
            return json.dumps(d)
    return ""


@API.route('/search/wikibase_item', methods=['GET'])
def search_wikibase_item():
    '''
    API route function searching for Wikibase item from Wikidata.
    It takes optonal paramters, which makes restriction on searching.

    Required json parameters
    -----------------------
    search_word : str
        Entered key word by whose will search process.
    value_type : list[str] [optional]
        List of Qnumber defining item inheritance. Meaning found item will be instance of class, which is subclass of this value/class.
    value_type_relation : str [optional]
        QNumber of relation, describing relation of item to `value_type`. If item should be instance , subclass or both of them.
    conflict_type : list[str] [optional]
        List of Qnumber defining item inheritance. Meaning found item won`t be instance of class, which is subclass of this value/class.
    conflict_type_relation : [str [optional]
        QNumber of relation, describing relation of item to `value_type_conflict`. If item should be instance , subclass or both of them.
    none_values : list[str] [optional]
        List of Qnumber defining that this item won`t be one of these values.

    Return
    ------
    JSON formatted str
        Data on found satisfying Wikibase items from Wikidata.
    '''
    data = json.loads(request.args.get("data"))

    search_word: str = data["search_word"]

    if search_word is None:
        return "Invalid request, `search_word` paramter must be provided"

    value_type: list[str] = data["value_type"]
    value_type_relation = data["value_type_relation"]
    conflict_type: list[str] = data["conflict_type"]
    conflict_type_relation = data["conflict_type_relation"]
    none_values: list[str] = data["none_values"]

    builder = SearchWikibaseItemQueryBuilder()
    builder.set_recursive_searching(True)
    builder.set_at_least_one_super_class_mandatory(False)
    builder.set_searched_word(search_word)
    builder.set_distinct(True)

    if conflict_type_relation is not None:
        builder.set_type_for_exceptions_classes(
            "wdt:" + conflict_type_relation)
    if value_type_relation is not None:
        match value_type_relation:
            case "instance of":
                builder.set_type_for_super_classes(TYPES.INSTANCES)
            case "subclass of":
                builder.set_type_for_super_classes(TYPES.CLASS)
            case "instance or subclass of":
                builder.set_type_for_super_classes(TYPES.INSTANCEORCLASS)

    for value in value_type:
        builder.add_super_class(value)

    for conflict_value in conflict_type:
        builder.add_exception_class(conflict_value)

    for none_value in none_values:
        builder.add_exception_constraint(none_value)
    
    return process_query(builder.build())


@API.route('/get/collectible_basic_info', methods=['GET'])
def get_collectible_basic_info():
    '''
    API route function for obtaining collectible`s base info from Wikidata.
    Base information are description and image of collectible, if image exists.

    Required json parameters
    -----------------------
    collectible_QNumber : str
        QNUmber of collectible, for which it will search link.

    Return
    ------
    JSON formatted str
        Data about found wikipedia link.
    '''

    data = json.loads(request.args.get("data"))

    collectible: str = data['collectible_QNumber']

    if collectible is None:
        return "Invalid request, `collectible_QNumber` parameter must be provided"

    builder = CollectibleBasicInfoQuery(collectible)
    return process_query(builder.build())


@API.route('/get/collectible_details', methods=['GET'])
def get_collectible_details():
    '''
    API route function for obtaining collectible`s details from Wikidata.

    Required json parameters
    -----------------------
    collectible_QNumber : str
        QNUmber of collectible, for which it will fetch details.

    Return
    ------
    JSON formatted str
        Data about found wikipedia link.
    '''
    data = json.loads(request.args.get("data"))

    collectible: str = data['collectible_QNumber']

    if collectible is None:
        return "Invalid request, `collectible_QNumber` parameter must be provided"

    builder = CollectibleDetailsQuery(collectible)
    
    return process_query(builder.build())


@API.route('/get/collectible_wikipedia_link', methods=['GET'])
def get_collectible_wikipedia_link():
    '''
    API route function for obtaining collectible`s link to wikipedia if exists.

    Required json parameters
    -----------------------
    collectible_QNumber : str
        QNUmber of collectible, for which it will search link.

    Return
    ------
    JSON formatted str
        Data about found wikipedia link.
    '''
    data = json.loads(request.args.get("data"))

    collectible: str = data['collectible_QNumber']

    if collectible is None:
        return "Invalid request,`collectible_QNumber` parameter must be provided"

    builder = WikiPediaLinkQuery(collectible)
   
    return process_query(builder.build())


@API.route('/search/collectibles', methods=['GET'])
def search_for_collectibles():
    '''
    From provided input json data, it constructs query, which fetches all satysfying collectibles from Wikidata.
    The Frontend takes user requirments for collectible, which user want to search for and then calls this API route.

    Required json parameters
    -----------------------
    type : str [required]
        QNUmber of `superclass` that limit which collectibles will be searched.
    exceptionsSubTypes : list[str] [optional]
        List of QNumbers, which define type exceptions. Searching ignores collectible which is sub-class of one of exception class.
    areaSearchType : str (value of these: [`Radius`,`Area`,`Region`,`World`]) [required] 
        String value of enum, which defines area restriction of searching.
        Each value needs some other required parameters. See below.
        For `World` there is not parameter.
    area : str [required if areaSearchType is `Area`]
        QNUmber of administrative area. Found collectibles lie in this area.
    exceptionsSubAreas : list[str] [optional if areaSearchType is `Area`]
        List of QNUmbers, which are sub areas of `area` parameter, meaning these areas are located in `area`.
        Found collectibles are located in `area`, but not in exception sub-areas.
    region : string [required if areaSearchType is `Region`]
        QNUmber of region such as Europe or East Asia. Found collectibles are located in this region.
    center : list[float] (contains only 2 elements) [required if areaSearchType is `Radius`]
        List contains longitude and latitude, which defines center of circle, in whose found collectible are located.
    radius : int [required if searchAreaType is `Radius`]
        Number representing radius of circle in kilometers.
    filter : list[dict] [optional]
        List of dict containing data about filter, which will be applied in searching.
        Each filter contains necessary data of that filter. See `FilterData` for gaining knowleadge.

    Return
    ------
    JSON formatted str
        Found collectibles data.
    '''
    data = json.loads(request.args.get("data"))

    # type parsing
    super_class: str = data['type']
    if super_class is None:
        return "Invalid request, `type` parameter must be provided"

    # exception sub-types parsing
    exceptions_sub_classes: list[str] = data['exceptionsSubTypes']

    # resolving type of area restriction
    search_area_type: str = data['areaSearchType']
    if search_area_type is None:
        return "Invalid request, `areaSearchType` parameter must be provided"
    type_of_area_restriction = Get_CollectiblesSearchType(search_area_type)

    builder = AdministrativeAreaCollectiblesSearchQueryBuilder(super_class)

    # resolving area restriction
    match type_of_area_restriction:
        case CollectiblesSearchType.ADMINISTRATIVE:
            builder = AdministrativeAreaCollectiblesSearchQueryBuilder(
                super_class)
            area: str = data['area']
            if area is None:
                return "Invalid request,`administrative_area` parameter must be provided"
            builder.set_administrative_area(area)

            area_exceptions: list[str] = data['exceptionsSubAreas']
            if area_exceptions is not None:
                for exc in area_exceptions:
                    builder.add_administrative_area_exception(exc)

        case CollectiblesSearchType.AROUND:
            builder = AroundCollectiblesSearchQueryBuilder(super_class)
            radius: int = int(data['radius'])
            if radius is None:
                return "Invalid request,`radius` parameter must be provided"
            builder.set_radius(radius)

            center = data['center']
            lat: float = float(center['lat'])
            if lat is None:
                return "Invalid request,`lat` must be provided in list `center` parameter"
            lng: float = float(center['lng'])
            if lng is None:
                return "Invalid request,`lng` must be provided in list `center` parameter"
            builder.set_center_by_coordinates(lat, lng)
        case CollectiblesSearchType.REGION:
            builder = RegionCollectiblesSearchQueryBuilder(super_class)

            region: str = data["region"]
            if region is None:
                return "Invalid request,`region` parameter must be provided"

            builder.set_region_area(region)
        case CollectiblesSearchType.WORLD:
            builder = WorldCollectiblesSearchQueryBuilder(super_class)

    if exceptions_sub_classes is not None:
        for exc in exceptions_sub_classes:
            builder.add_class_exception(exc)

    filters: list[dict] = data['filters']
    # filter resolving
    if filters is not None:
        try:
            for item in filters:
                property: str = item['property']
                filter_type = get_FilterType(item['filterType'])
                match (filter_type):
                    case FilterType.WIKIBASEITEM:
                        value: str = item['data']['item']
                        builder.add_item_filter(property, value)
                    case FilterType.QUANTITY:
                        comparison_operator = get_ComparisonOperator(
                            item['data']['comparisonOperator'])
                        quantity_value: int = item['data']['value']
                        unit: str = item['data']['unit']
                        builder.add_quantity_filter(
                            property, comparison_operator, quantity_value, unit)
                    case FilterType.TIME:
                        comparison_operator = get_ComparisonOperator(
                            item['data']['comparisonOperator'])
                        time_value: str = item['data']['time']
                        builder.add_time_filter(
                            property, comparison_operator, time_value)
        except:
            return "Invalid request,parameter `filter` was provided incorect"
    
    return process_query(builder.build())

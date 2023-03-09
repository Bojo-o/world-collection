from .BaseQueryBuilder import QueryBaseBuilder

class QueryAroundSearchBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class QueryAroundSearchBuilder(QueryBaseBuilder):
    def __init__(self,super_class_Qnumber : str) -> None:
        super().__init__(super_class_Qnumber)
        self._center : str|None = None
        self._center_by_coord_flag : bool = False
        self._radius = 1

    def set_center_as_entity(self,Qnumber_of_center : str) -> None:
        self._center = Qnumber_of_center

    def set_center_by_coordinates(self,latitude : float,longitude : float):
        # arguments validation
        if latitude > 90 or latitude < -90:
            raise QueryAroundSearchBuilderException("The latitude parameters range is from -90.0 to 90.0")
        if longitude > 180 or longitude < -180:
            raise QueryAroundSearchBuilderException("The longitude parameters range is from -180.0 to 180.0")

        self._center = "Point({0} {1})".format(latitude,longitude)
        self._center_by_coord_flag = True
    
    def set_radius(self,radius_in_km : int):
        if radius_in_km < 1 or radius_in_km > 500:
            raise QueryAroundSearchBuilderException("The supported radius parameters range is from 1 km to 500 km")
        self._radius = radius_in_km

    def _inner_build(self):
        #check 
        if self._center is None:
            raise QueryAroundSearchBuilderException("The center was not set")

        # add around service
        if self._center_by_coord_flag == False:
            self._query.append("wd:{0} wdt:P625 ?locationOfCenter . ".format(self._center))
        
        self._query.append("SERVICE wikibase:around { ?collectible wdt:P625 ?geo . bd:serviceParam wikibase:center "
        + ("\"{}\"^^geo:wktLiteral.".format(self._center) if self._center_by_coord_flag else "?locationOfCenter")
        +". bd:serviceParam wikibase:radius \""
        + str(self._radius) +"\" . }")

        # add filter
        self._query.append("FILTER EXISTS {?collectible wdt:P31/wdt:P279* wd:" + self._super_class + " .}")
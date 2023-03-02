from abc import ABC,abstractmethod

class QueryBaseBuilder(ABC):
    def __init__(self,super_class_Qnumber : str) -> None:
        self._super_class = super_class_Qnumber
        self._class_exceptions = set()
        self._query = []

    def __append_header(self):
        self._query.append("SELECT DISTINCT ?collectible ?collectibleLabel (SAMPLE(?geo) AS ?coord) (GROUP_CONCAT( DISTINCT ?instancesLabel;separator=\"/\") AS ?isInstanceOf)")
        self._query.append("WHERE {")

    def __append_footer(self):
        # get instances
        self._query.append("?collectible wdt:P31 ?instances.")
        # add service for label 
        self._query.append("""SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". ?instances rdfs:label ?instancesLabel .?collectible rdfs:label ?collectibleLabel .}""")
        # end and group by
        self._query.append("} group by ?collectible ?collectibleLabel ")

    def __convert_set(self,set : set):
        list = []
        for item in set:
            list.append("wd:" + item + " ")
        return "" . join(list)

    def add_class_exception(self,Qnumber_of_class: str):
        self._class_exceptions.add(Qnumber_of_class)
    
    def __append_class_exceptions(self):
        if self._class_exceptions.__len__ == 0 :
            return
        self._query.append("MINUS {VALUES ?classExceptions { " + self.__convert_set(self._class_exceptions) + " } ?collectible wdt:P31/wdt:P279* ?classExceptions .}")
    def build(self) -> str:
        self._query.clear()
        self.__append_header()
        self._inner_build()
        self.__append_class_exceptions()
        self.__append_footer()

        return '\n'.join(self._query)

    @abstractmethod
    def _inner_build(self):
        pass



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

class QueryAreaSearchBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    

class QueryAreaSearchBuilder(QueryBaseBuilder):
    def __init__(self,super_class_Qnumber : str) -> None:
        super().__init__(super_class_Qnumber)
        self._administrative_area = None

    def set_search_area(self,Qnumber_of_administrative_area : str):
        self._administrative_area = Qnumber_of_administrative_area

    def _inner_build(self):
        # check
        if self._administrative_area is None:
            raise QueryAreaSearchBuilderException("The area of search was not set")

        self._query.append("?collectible wdt:P31/wdt:P279* wd:{}.".format(self._super_class))
        

        self._query.append("?collectible wdt:P131* wd:{}.".format(self._administrative_area))
        self._query.append("hint:Prior hint:gearing \"forward\".")

        # get coord
        self._query.append("?collectible wdt:P625 ?geo.")

x = QueryAreaSearchBuilder("Q33506")
x.set_search_area("Q214")
x.add_class_exception("Q207694")
x.add_class_exception("Q43501")
print(x.build())

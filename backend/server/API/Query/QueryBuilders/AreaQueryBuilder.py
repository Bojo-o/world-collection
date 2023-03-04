from .BaseQueryBuilder import QueryBaseBuilder

class QueryAreaSearchBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    

class QueryAreaSearchBuilder(QueryBaseBuilder):
    def __init__(self,super_class_Qnumber : str) -> None:
        super().__init__(super_class_Qnumber)
        self._administrative_area = None
        self._area_exceptions = set()

    def set_search_area(self,Qnumber_of_administrative_area : str):
        self._administrative_area = Qnumber_of_administrative_area
    def add_area_exception(self, Qnumber_of_class: str):
        self._area_exceptions.add(Qnumber_of_class)
    def __append_area_exceptions(self):
        if self._area_exceptions.__len__ == 0 :
            return
        self._query.append("MINUS {VALUES ?areaExceptions { " + super().convert_set(self._area_exceptions) + " } ?collectible wdt:P131* ?areaExceptions .}")
    def _inner_build(self):
        # check
        if self._administrative_area is None:
            raise QueryAreaSearchBuilderException("The area of search was not set")

        self._query.append("?collectible wdt:P31/wdt:P279* wd:{}.".format(self._super_class))
        

        self._query.append("?collectible wdt:P131* wd:{}.".format(self._administrative_area))
        self._query.append("hint:Prior hint:gearing \"forward\".")
        self.__append_area_exceptions()
        # get coord
        self._query.append("?collectible wdt:P625 ?geo.")


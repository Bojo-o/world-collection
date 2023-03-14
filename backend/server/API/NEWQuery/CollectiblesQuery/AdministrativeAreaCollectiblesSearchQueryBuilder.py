from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class AdministrativeAreaCollectiblesSearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    

class AdministrativeAreaCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

        self._administrative_area = None
        self._area_exceptions = set()

        self._IN_ADMIN_AREA = "P131*"

    def set_search_area(self,Qnumber_of_administrative_area : str):
        self._administrative_area = Qnumber_of_administrative_area

    def add_area_exception(self, Qnumber_of_class: str):
        self._area_exceptions.add(Qnumber_of_class)

    def build_class_and_location_restriction(self):
        if self._administrative_area is None:
            raise AdministrativeAreaCollectiblesSearchQueryBuilderException("The area of search was not set")
        
        self.build_class_restriction()

        self.add_triple("?item","wdt:{}".format(self._IN_ADMIN_AREA),"wd:{}".format(self._administrative_area))
        self.add_hint()

        if self._area_exceptions.__len__ != 0 :
            self.build_statement("?item","?areaExceptions","wdt:{}".format(self._IN_ADMIN_AREA),self._area_exceptions,True,True)
        

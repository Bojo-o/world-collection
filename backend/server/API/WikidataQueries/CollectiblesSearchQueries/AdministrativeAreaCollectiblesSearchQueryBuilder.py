from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class AdministrativeAreaCollectiblesSearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    

class AdministrativeAreaCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    '''
    Builder for creating query, which inherited from `CollectiblesSearchQueryBuilder` and overide 
    `build_class_and_location_restriction`. In that method its implements mechanism for filtering collectibles, which lies in provided Administrative area.
    '''
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

        self._administrative_area = None
        self._administrative_area_exceptions = set()

        self._IN_ADMIN_AREA = "P131*"

    def set_administrative_area(self,Qnumber_of_administrative_area : str):
        '''
        Sets administrative area, which means finded collectibles would be in this administrative area.
        '''
        self._administrative_area = Qnumber_of_administrative_area

    def add_administrative_area_exception(self, Qnumber_of_class: str):
        '''
        Adds administrative area exceptions, which means finded collectibles would not be in this exception areas.

        Paramets
        --------
        Qnumber_of_class: str
            QNumber of administrative area.
        '''
        self._administrative_area_exceptions.add(Qnumber_of_class)

    def build_class_and_location_restriction(self):
        if self._administrative_area is None:
            raise AdministrativeAreaCollectiblesSearchQueryBuilderException("The area of search was not set")
        
        self.build_class_restriction()

        self.add_triple("?item","wdt:{}".format(self._IN_ADMIN_AREA),"wd:{}".format(self._administrative_area))
        self.add_gearing_forward_hint()

        if self._administrative_area_exceptions.__len__ != 0 :
            self.restriction_wrapper("?item","?areaExceptions","wdt:{}".format(self._IN_ADMIN_AREA),self._administrative_area_exceptions,True,True)
        

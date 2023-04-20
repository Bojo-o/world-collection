from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class RegionCollectiblesSearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    
class RegionCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    '''
    Builder for creating query, which inherited from `CollectiblesSearchQueryBuilder` and overide 
    `build_class_and_location_restriction`. In that method its implements mechanism for filtering collectibles, which lies in provided region such as Europe , East Asia ....
    '''
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

        self._region : str|None = None
        self._COUNTRY = "P17"
        self._PART_OF = "P361"
        self._COUNTRY_CLASS = "Q6256"

    def set_region_area(self,Qnumber_of_region_area : str):
        self._region = Qnumber_of_region_area

    def build_class_and_location_restriction(self):
        if self._region is None:
            raise RegionCollectiblesSearchQueryBuilderException("The region of search was not set")
        
        self.build_class_restriction()

        self.add_triple("?countries","wdt:{}*".format(self._PART_OF),"wd:{}".format(self._region))
        self.add_triple("?countries","wdt:{}".format("P31"),"wd:{}".format(self._COUNTRY_CLASS))
        self.add_triple("?item","wdt:{}".format(self._COUNTRY),"?temp")
        self.filter_wrapper("?temp in ( ?countries )")


from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class RegionCollectiblesSearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)    
class RegionCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

        self._region : str|None = None
        self._COUNTRY = "P17"
        self._PART_OF = "P361"
    def set_region_area(self,Qnumber_of_region_area : str):
        self._region = Qnumber_of_region_area

    def build_class_and_location_restriction(self):
        if self._region is None:
            raise RegionCollectiblesSearchQueryBuilderException("The region of search was not set")
        
        self.build_class_restriction()

        self.add_query_hint()
        self.add_triple("?item","wdt:{}/wdt:{}*".format(self._COUNTRY,self._PART_OF),"wd:{}".format(self._region))
        self.add_hint()


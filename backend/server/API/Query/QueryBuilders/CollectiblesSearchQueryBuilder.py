from .QueyBuilders import QueryAroundSearchBuilder

class CollectiblesSearchQueryBuilder:
    
    def __init__(self,super_class_Qnumber : str) -> None:
        self._super_class = super_class_Qnumber
    
    def search_around_point(self) -> QueryAroundSearchBuilder:
        return QueryAroundSearchBuilder(self._super_class)

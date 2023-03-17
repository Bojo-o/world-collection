from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class CollectibleDataGetterException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class CollectibleDataGetter(CollectiblesSearchQueryBuilder):

    def __init__(self):
        super().__init__(None)

        self._variable_set = set()
    
    def set_collectible(self,Qnumber : str):
        self._variable_set.add(Qnumber)

    def build_class_and_location_restriction(self):
        if self._variable_set.__len__() == 0:
            raise CollectibleDataGetterException("At least one collectible must be setted")
        self.define_values_variable("?item",self._variable_set,"wd:")

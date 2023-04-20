from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class CollectibleDataGetterException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class CollectibleDataGetter(CollectiblesSearchQueryBuilder):
    '''
    Builder for creating query, which inherited from `CollectiblesSearchQueryBuilder` and overide 
    `build_class_and_location_restriction`.
    
    It serves for obtaining collectible base data from only providing QNumber of collectible.
    '''
    def __init__(self):
        super().__init__(None)

        self._variable_set = set()
    
    def set_collectible(self,Qnumber_of_collectible : str):
        '''
        Sets collectible, for which will data be obtained.

        Parameters
        ---------
        QNumber_of_collectible : str
            QNumber of collectible.
        '''
        self._variable_set.add(Qnumber_of_collectible)

    def build_class_and_location_restriction(self):
        if self._variable_set.__len__() == 0:
            raise CollectibleDataGetterException("At least one collectible must be setted")
        self.define_values_variable("?item",self._variable_set,"wd:")
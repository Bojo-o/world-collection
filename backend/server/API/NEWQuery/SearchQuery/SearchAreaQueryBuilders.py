from .SearchByClassRestrictionQueryBuilder import SearchByClassRestrictionQueryBuilder,TYPES

class SearchCollectibleTypesQueryBuilder(SearchByClassRestrictionQueryBuilder):
    def __init__(self) -> None:
        super().__init__(TYPES.CLASS)
        self.set_recursive_searching(True)
        
    def create_more_restrictions(self):
        pass

class SearchAreaQueryBuilder(SearchByClassRestrictionQueryBuilder):
    def __init__(self) -> None:
        super().__init__(TYPES.INSTANCEORCLASS)
        self._geo_flag : bool = False
        self._located_in_area = set()
        self._not_located_in_area = set()
        self._recursive_flag_for_located_in_area = False
        self._LOCATED_IN_AREA_STATEMENT : str = "wdt:P131"
    
    def set_geo_obtaining(self):
        self._geo_flag = True
        self.select_variable("?lat","?lati")
        self.select_variable("?lon","?long")

    def set_recursive_searching_for_located_in_area(self):
        self._recursive_flag_for_located_in_area = True
    
    def add_located_in_area(self,Qnumber_of_area : str):
        self._located_in_area.add(Qnumber_of_area)

    def add_not_located_in_area(self,Qnumber_of_area : str):
        self._not_located_in_area.add(Qnumber_of_area)

    def create_more_restrictions(self):

        if self._located_in_area.__len__() != 0:
            #self.__build_restriction("locatedInAreas",self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,self._located_in_area,False,True if self._recursive_flag_for_located_in_area else False)
            self.build_restriction("?locatedInAreas",
                                    self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,
                                    self._located_in_area,
                                    True if self._recursive_flag_for_located_in_area else False,
                                    False
                                    )
        if self._not_located_in_area.__len__() != 0:
            #self.__build_predicate("notLocatedInAreas",self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,self._not_located_in_area,True,True if self._recursive_flag_for_located_in_area else False)
            self.build_restriction("?notLocatedInAreas",
                                    self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,
                                    self._not_located_in_area,
                                    True if self._recursive_flag_for_located_in_area else False,
                                    True
                                    )
        if self._geo_flag:
            self.get_coordinates_of_object("?item")


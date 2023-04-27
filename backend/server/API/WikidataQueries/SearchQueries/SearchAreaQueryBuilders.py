from .SearchByClassRestrictionQueryBuilder import SearchByClassRestrictionQueryBuilder, TYPES


class SearchAreaQueryBuilder(SearchByClassRestrictionQueryBuilder):
    '''
    Builder for creating query, which will search for area locations on Wikidata.
    In this project it is used for search administrative areas.
    '''

    def __init__(self) -> None:
        super().__init__(TYPES.INSTANCEORCLASS)
        self._geo_flag: bool = False
        self._located_in_area = set()
        self._not_located_in_area = set()
        self._recursive_flag_for_located_in_area = False
        self._LOCATED_IN_AREA_STATEMENT: str = "wdt:P131"

    def set_recursive_searching_for_located_in_area(self):
        '''
        Sets recursivly searching for areas.
        '''
        self._recursive_flag_for_located_in_area = True

    def add_located_in_area_resctriction(self, Qnumber_of_area: str):
        '''
        Adds into query restriction. Found locations are located in provided location.

        Parameters
        ----------
        Qnumber_of_area : str
            QNumber of location.
        '''
        self._located_in_area.add(Qnumber_of_area)

    def add_not_located_in_area_resctriction(self, Qnumber_of_area: str):
        '''
        Adds into query restriction. Found locations are not located in provided location.

        Parameters
        ----------
        Qnumber_of_area : str
            QNumber of location.
        '''
        self._not_located_in_area.add(Qnumber_of_area)

    def create_more_restrictions(self):

        if self._located_in_area.__len__() != 0:
            self.restriction_wrapper("?item", "?locatedInAreas",
                                     self._LOCATED_IN_AREA_STATEMENT +
                                     "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,
                                     self._located_in_area,
                                     True if self._recursive_flag_for_located_in_area else False,
                                     False
                                     )
        if self._not_located_in_area.__len__() != 0:
            self.restriction_wrapper("?item", "?notLocatedInAreas",
                                     self._LOCATED_IN_AREA_STATEMENT +
                                     "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,
                                     self._not_located_in_area,
                                     True if self._recursive_flag_for_located_in_area else False,
                                     True
                                     )

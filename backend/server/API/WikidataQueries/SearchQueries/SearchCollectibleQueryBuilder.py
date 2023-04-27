from .SearchByClassRestrictionQueryBuilder import SearchByClassRestrictionQueryBuilder, TYPES

GEO_LOCATION: str = "Q2221906"  # geographic location


class SearchCollectibleQueryBuilder(SearchByClassRestrictionQueryBuilder):
    '''
    Builder for creating query, which search for collectible on Wikidata.
    In this collectible means something, which has coordinates on the Earth.
    '''

    def __init__(self) -> None:
        super().__init__(TYPES.INSTANCEORCLASS)

        self.add_variable_into_select("?lat", "?lati")
        self.add_variable_into_select("?lon", "?long")

        self.add_super_class(GEO_LOCATION)
        self.set_recursive_searching(True)

    def create_more_restrictions(self):
        self.get_coordinates_of_object("?item")

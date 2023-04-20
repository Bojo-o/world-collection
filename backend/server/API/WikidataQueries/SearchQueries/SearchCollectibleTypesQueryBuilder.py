from .SearchByClassRestrictionQueryBuilder import SearchByClassRestrictionQueryBuilder,TYPES

GEO_LOCATION : str = "Q2221906" # geographic location

class SearchCollectibleTypesQueryBuilder(SearchByClassRestrictionQueryBuilder):
    '''
    Builder for creating query, which will search for collectible types on Wikidata.
    Types means classes that collectibles can be a sub-class of.
    '''
    def __init__(self,super_class : str = None,exceptions_classes : list[str] = None) -> None:
        super().__init__(TYPES.CLASS)
        self.set_recursive_searching(True)

        if super_class is not None:
            self.add_super_class(super_class)
        else:
            self.add_super_class(GEO_LOCATION)
    

        if exceptions_classes is not None:
            for item in exceptions_classes:
                self.add_exception_class(item)
        
    def create_more_restrictions(self):
        pass
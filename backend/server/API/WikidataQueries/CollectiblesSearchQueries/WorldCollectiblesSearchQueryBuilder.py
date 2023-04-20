from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class WorldCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    '''
    Builder for creating query, which inherited from `CollectiblesSearchQueryBuilder` and overide 
    `build_class_and_location_restriction`. In that method its not implement any mechanism for location restriction, because this search of the entire world.It only call class restriction.
    '''
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

    def build_class_and_location_restriction(self):
        self.build_class_restriction()
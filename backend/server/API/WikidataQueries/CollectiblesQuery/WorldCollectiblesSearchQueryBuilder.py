from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class WorldCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

    def build_class_and_location_restriction(self):
        self.build_class_restriction()
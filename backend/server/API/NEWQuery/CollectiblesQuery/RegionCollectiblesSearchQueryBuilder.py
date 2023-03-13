from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class RegionCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    def __init__(self, parent_class: str):
        super().__init__(parent_class)

    def build_class_and_location_restriction(self):
        return super().build_class_and_location_restriction()
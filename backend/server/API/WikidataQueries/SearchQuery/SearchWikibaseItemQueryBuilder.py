from .SearchByClassRestrictionQueryBuilder import TYPES, SearchByClassRestrictionQueryBuilder

class SearchWikibaseItemQueryBuilder(SearchByClassRestrictionQueryBuilder):
    def __init__(self) -> None:
        super().__init__(TYPES.INSTANCES)
        self._none_of_constraint = set()

    def reset_type_for_super_classes(self,type : str):
        self._type_for_super_classes = type

    def reset_type_for_exceptions_classes(self,type : str):
        self._type_for_exceptions_classes = type

    def add_none_of_constraint(self,Qnumber : str):
        self._none_of_constraint.add(Qnumber)

    def create_more_restrictions(self):
        self.filter_wrapper("?item not in ({})".format(self.convert_set(self._none_of_constraint,", wd:")[1:]))
from .SearchByClassRestrictionQueryBuilder import TYPES, SearchByClassRestrictionQueryBuilder

class SearchWikibaseItemQueryBuilder(SearchByClassRestrictionQueryBuilder):
    '''
    Builder for creating query, which will search for WikibaseItems on Wikidata.
    '''
    def __init__(self) -> None:
        super().__init__(TYPES.INSTANCES)
        self._exception_constraints = set()

    def set_type_for_super_classes(self,type : TYPES):
        '''
        Sets type into query for super classes, meaning if we search for classes, instances or both of them.

        Parameters
        ---------
        type : TYPES
            Type of relation.
        '''
        self._type_for_super_classes = type.value

    def set_type_for_exceptions_classes(self,type_QNumber : str):
        '''
        Sets type into query for exceptions, meaning in what relation are exception classes with searching items.

        Parameters
        ---------
        type_QNumber : str
            QNUmber of Type of relation.
        '''
        self._type_for_exceptions_classes = type_QNumber

    def add_exception_constraint(self,constraint_Qnumber : str):
        '''
        Adds into query constain, meaning that, the results, which will be returned by Wikidata, can not be this constaint.
        Parameters
        ---------
        constraint_Qnumber : str
            QNUmber of constaint, that can not be return as results.
        '''
        self._exception_constraints.add(constraint_Qnumber)

    def create_more_restrictions(self):
        self.filter_wrapper("?item not in ({})".format(self.convert_set(self._exception_constraints,", wd:")[1:]))
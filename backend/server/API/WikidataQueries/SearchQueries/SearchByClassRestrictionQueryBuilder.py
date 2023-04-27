from abc import ABC, abstractmethod
from enum import Enum
from .SearchQueryBuilder import SearchQueryBuilder


class SearchByClassRestrictionQueryBuilderBuilderException(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class TYPES(Enum):
    '''
    Enum for defining, if we are searching for classes, instances or both of them.
    '''
    CLASS = "wdt:P279"
    INSTANCES = "wdt:P31"
    INSTANCEORCLASS = "wdt:P31/wdt:P279"


class SearchByClassRestrictionQueryBuilder(SearchQueryBuilder, ABC):
    '''
    Abstract class, which inherits from the base SearchQuery and joins into it mechanims for making types restrictions.
    That means for example that, we are only searching for spesific classes, which are sub-classes of some class.
    '''

    def __init__(self, type: TYPES) -> None:
        super().__init__()

        self._super_class_mandatory = True
        self._super_classes = set()
        self._exceptions_classes = set()

        self._type_for_super_classes: str = type.value
        self._type_for_exceptions_classes: str = type.value

        self._recursive_searching_flag = False

    def add_super_class(self, Qnumber_of_type: str):
        '''
        Adds super class restriction into query, that means all results must be sub-classes or instances of that class.

        Parameter
        ---------
        Qnumber_of_type : str
            QNumber of super class.
        '''
        self._super_classes.add(Qnumber_of_type)

    def add_exception_class(self, Qnumber_of_type: str):
        '''
        Adds exception class restriction into query, that means all results must not be sub-classes or instances of that class.

        Parameter
        ---------
        Qnumber_of_type : str
            QNumber of exception class.
        '''
        self._exceptions_classes.add(Qnumber_of_type)

    def set_recursive_searching(self, flag: bool):
        '''
        Adds into query mechanism for recursive searching, meaning it search recursivly all sub-classes. 

        Parameter
        --------
        flag : bool
            Truth value of flag.
        '''
        self._recursive_searching_flag = flag

    def set_at_least_one_super_class_mandatory(self, flag: bool):
        '''
        If it is not at least one super class setted , its raises a exception.
        But under specific case we do not want set any super class. For this cases call this flag method.

        flag : bool
            Truth value of flag.
        '''
        self._super_class_mandatory = flag

    def build_seach_body(self):
        if self._super_classes.__len__() == 0 and self._super_class_mandatory:
            raise SearchByClassRestrictionQueryBuilderBuilderException(
                "There must be set at least one super class , which restricts search")

        if self._super_classes.__len__() != 0:
            self.restriction_wrapper("?item", "?classRestrictions",
                                     "{}*".format(
                                         self._type_for_super_classes) if self._recursive_searching_flag else self._type_for_super_classes,
                                     self._super_classes,
                                     True if self._recursive_searching_flag else False
                                     )

        if self._exceptions_classes.__len__() != 0:
            self.restriction_wrapper("?item", "?classExceptionRestrictions",
                                     "{}*".format(
                                         self._type_for_exceptions_classes) if self._recursive_searching_flag else self._type_for_exceptions_classes,
                                     self._exceptions_classes,
                                     True if self._recursive_searching_flag else False,
                                     True
                                     )
        self.create_more_restrictions()

    @abstractmethod
    def create_more_restrictions(self):
        '''
        Method for overriding  in inherited objects.
        Made for making adding more restrictions in "Where" part in query.
        '''
        pass

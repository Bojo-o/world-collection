from abc import ABC, abstractmethod
from enum import Enum
from .SearchBaseQueryBuilder import SearchBaseQueryBuilder

class SearchByClassRestrictionQueryBuilderBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class TYPES(Enum):
    CLASS = "wdt:P279"
    INSTANCES = "wdt:P31/wdt:P279"

class SearchByClassRestrictionQueryBuilder(SearchBaseQueryBuilder,ABC):
    def __init__(self,type : TYPES) -> None:
        super().__init__()

        self._super_classes = set()
        self._exceptions_classes = set()

        self._type = type
        self._recursive_searching_flag = False
    
    def add_super_class(self,Qnumber_of_type : str):
        self._super_classes.add(Qnumber_of_type)
    
    def add_exception_class(self,Qnumber_of_type : str):
        self._exceptions_classes.add(Qnumber_of_type)

    def set_recursive_searching(self,flag : bool):
        self._recursive_searching_flag = flag

    def __build_restriction(self,value_name : str,predicate : str,values : set,add_hint = False, minus_flag = False,):
        if minus_flag:
            self._query.append("MINUS{")

        self.define_values_variable(value_name,values,"wd:")
        self.add_triple("?item",predicate,value_name)

        if add_hint:
            self.add_hint()

        if minus_flag:
            self._query.append("}")

    def build_seach_body(self):
        if self._super_classes.__len__() == 0:
            raise SearchByClassRestrictionQueryBuilderBuilderException("There must be set at least one super class , which restricts search")
        
        self.__build_restriction("?classRestrictions",
                                self._type.value+"*" if self._recursive_searching_flag else self._type.value,
                                self._super_classes,
                                True if self._recursive_searching_flag else False
                                )

        if self._exceptions_classes.__len__() != 0:
            self.__build_restriction("?classExceptionRestrictions",
                                    self._type.value+"*" if self._recursive_searching_flag else self._type.value,
                                    self._exceptions_classes,
                                    True if self._recursive_searching_flag else False,
                                    True
                                    )
        self.create_more_restrictions()

    @abstractmethod
    def create_more_restrictions(self):
        pass

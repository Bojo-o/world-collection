from abc import ABC, abstractmethod

class SearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class SearchBaseQueryBuilder(ABC):
    def __init__(self,statment : str) -> None:
        self._searched_word : str|None = None
        self._query = []
        self._super_classes = set()
        self._exceptions_classes = set()
        self._statment : str = statment
        self._geo_flag : bool = False
        self._located_in_area = set()
        self._not_located_in_area = set()
        self._recursive_flag_for_located_in_area = False
        self._LOCATED_IN_AREA_STATEMENT : str = "wdt:P131"

    def convert_set(self,set : set):
        list = []
        for item in set:
            list.append("wd:" + item + " ")
        return "" . join(list)
    
    def set_geo_obtaining(self):
        self._geo_flag = True
    def set_recursive_searching_for_located_in_area(self):
        self._recursive_flag_for_located_in_area = True
    def set_seach_by_word(self,word : str):
        self._searched_word = word

    def add_super_class(self,Qnumber_of_class : str):
        self._super_classes.add(Qnumber_of_class)
    
    def add_exception_class(self,Qnumber_of_class : str):
        self._exceptions_classes.add(Qnumber_of_class)

    def add_located_in_area(self,Qnumber_of_area : str):
        self._located_in_area.add(Qnumber_of_area)

    def add_not_located_in_area(self,Qnumber_of_area : str):
        self._not_located_in_area.add(Qnumber_of_area)

    def __append_header(self):
        geo = "?coord" if self._geo_flag else ""
        self._query.append("SELECT DISTINCT  ?item ?itemLabel ?description " + geo)
        self._query.append("WHERE {")

    def __append_footer(self):
        self._query.append("?item schema:description ?description.")
        self._query.append("""FILTER ( lang(?description) = "en" )""")      
        self._query.append("""SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }""")
        self._query.append("} ORDER BY ASC(?num) ")

    def __append_hint(self):
        self._query.append("hint:Prior hint:gearing \"forward\".")

    def __build_predicate(self,values_name : str,statment : str,values : set,minus_flag = False,add_hint = True):
        if minus_flag:
            self._query.append("MINUS{")

        self._query.append(" VALUES ?" + values_name + " {" + self.convert_set(values) + " }")
        self._query.append(" ?item {} ?{}.".format(statment,values_name))

        if add_hint:
            self.__append_hint()

        if minus_flag:
            self._query.append("}")
    def build(self) -> str:

        if self._super_classes.__len__() == 0:
            raise SearchQueryBuilderException("There must be set at least one super class")
        
        self._query.clear()
        self.__append_header()
        if self._searched_word is not None:
            self._query.append("SERVICE wikibase:mwapi{ bd:serviceParam wikibase:endpoint \"www.wikidata.org\";wikibase:api \"EntitySearch\"; mwapi:search \"" + self._searched_word + "\"; mwapi:language \"en\".?item wikibase:apiOutputItem mwapi:item. ?num wikibase:apiOrdinal true.}")
        
        # super classes
        self.__build_predicate("superClasses",self._statment,self._super_classes)

        # exceptions
        if self._exceptions_classes.__len__() != 0:
            self.__build_predicate("exceptionClasses",self._statment,self._exceptions_classes,True)

        if self._located_in_area.__len__() != 0:
            self.__build_predicate("locatedInAreas",self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,self._located_in_area,False,True if self._recursive_flag_for_located_in_area else False)
            
        if self._not_located_in_area.__len__() != 0:
            self.__build_predicate("notLocatedInAreas",self._LOCATED_IN_AREA_STATEMENT + "*" if self._recursive_flag_for_located_in_area else self._LOCATED_IN_AREA_STATEMENT,self._not_located_in_area,True,True if self._recursive_flag_for_located_in_area else False)

        if self._geo_flag:
            self._query.append("?item wdt:P625 ?coord .")

        self.__append_footer()

        return '\n'.join(self._query)


class SearchClassesQueryBuilder(SearchBaseQueryBuilder):
    def __init__(self) -> None:
        super().__init__("wdt:P279*")
    

class SearchInstancesQueryBuilder(SearchBaseQueryBuilder):
    def __init__(self) -> None:
        super().__init__("wdt:P31/wdt:P279*")
    

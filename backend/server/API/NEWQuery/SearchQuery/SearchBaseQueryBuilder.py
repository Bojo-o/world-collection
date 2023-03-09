from abc import ABC, abstractmethod
from ..QueryBuilder import QueryBuilder

class SearchQueryBaseBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class SearchBaseQueryBuilder(QueryBuilder,ABC):
    def __init__(self) -> None:
        super().__init__()

        self._searched_word : str|None = None


        self.select_variable("?item","?QNumber",True,"?name")
        self.select_variable("?description")
        self.set_distinct(True)

        self.add_order_by_("ASC(?num)")


    def set_seach_by_word(self,word : str):
        self._searched_word = word

    def add_search_service(self,append_to_variable_name : str,language : str = "en"):
        if self._searched_word is  None:
            raise SearchQueryBaseBuilderException("For search service must be set search word")
        
        self.add_service("wikibase:mwapi","bd:serviceParam wikibase:endpoint \"www.wikidata.org\";wikibase:api \"EntitySearch\";" +
                            "mwapi:search \"{}\"; ".format(self._searched_word) + 
                            "mwapi:language \"{}\" .".format(language) +
                            " {} wikibase:apiOutputItem mwapi:item. ?num wikibase:apiOrdinal true.".format(append_to_variable_name))
    
    def build_where_body(self):
        
        if self._searched_word is not None:
            self.add_search_service("?item")

        self.build_seach_body()
        
        # get desc
        self.add_triple("?item","schema:description","?description")
        self.add_filter("lang(?description) = \"en\"")
        # add label service
        #self.add_service("wikibase:label","bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\".")
        self.add_label_servise()

    @abstractmethod
    def build_seach_body(self):
        pass


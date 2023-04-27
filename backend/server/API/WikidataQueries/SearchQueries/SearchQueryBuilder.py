from abc import ABC, abstractmethod
from ..QueryBuilder import QueryBuilder


class SearchQueryBaseBuilderException(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class SearchQueryBuilder(QueryBuilder, ABC):
    '''
    Abstract class, which can include into query search service.
    Also it fetches description of searched items.
    Contains `build_seach_body` method , which must be overrided by inherited classes. This method behaves in inherited classes as `build_where_body`,
    because in `build_where_body` is implemented searching mechanism.
    '''

    def __init__(self) -> None:
        super().__init__()

        self._searched_word: str | None = None

        self.add_variable_into_select("?item", "?QNumber", True, "?name")
        self.add_variable_into_select("?description")
        self.set_distinct(True)

        self.add_order_by_("ASC(?num)")

    def set_searched_word(self, word: str):
        self._searched_word = word

    def __add_search_service(self, append_to_variable_name: str, language: str = "en"):
        """
        Private method for joining into query search service.

        Parameters
        ----------
        append_to_variable_name : str
            Name of variable, into which during query will be serach results stored.
        language : str [optional , English sets as default]
            Language of searching.

        """
        if self._searched_word is None:
            raise SearchQueryBaseBuilderException(
                "For search service must be set search word")

        self.service_wrapper("wikibase:mwapi", "bd:serviceParam wikibase:endpoint \"www.wikidata.org\";wikibase:api \"EntitySearch\";" +
                             "mwapi:search \"{}\"; ".format(self._searched_word) +
                             "mwapi:language \"{}\" .".format(language) +
                             " {} wikibase:apiOutputItem mwapi:item. ?num wikibase:apiOrdinal true.".format(append_to_variable_name))

    def build_where_body(self):

        if self._searched_word is not None:
            self.__add_search_service("?item")

        self.build_seach_body()

        # get desc
        self.add_triple("?item", "schema:description", "?description")
        self.filter_wrapper("lang(?description) = \"en\"")
        self.add_label_servise()

    @abstractmethod
    def build_seach_body(self):
        '''
        Method for overriding  in inherited objects.
        Made for adding others thing into "Where" part in query.
        '''
        pass

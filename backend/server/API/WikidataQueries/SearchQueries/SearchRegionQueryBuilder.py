from .SearchQueryBuilder import SearchQueryBuilder


class SearchRegionQueryBuilder(SearchQueryBuilder):
    '''
    Builder for creating query, which will search for item on Wikidata, that are instances of regions of words.
    That conclude continets as Europe, Asia ... but also more specific regions as East Europe or Centre Europe.
    '''

    def __init__(self) -> None:
        super().__init__()

        self._SOVEREIGN_STATE = "Q3624078"

    def build_seach_body(self):
        self.add_triple("?country", "wdt:P31",
                        "wd:{}".format(self._SOVEREIGN_STATE))
        self.union_wrapper(
            "?country wdt:P361 ?item. ?item wdt:P31 wd:Q82794.", "?item wdt:P31 wd:Q5107.")
        self.filter_wrapper("?item not in (wd:Q2)")

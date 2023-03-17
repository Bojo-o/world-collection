from .SearchBaseQueryBuilder import SearchBaseQueryBuilder

class SearchRegionQueryBuilder(SearchBaseQueryBuilder):
    def __init__(self) -> None:
        super().__init__()

        self._SOVEREIGN_STATE = "Q3624078"
    def build_seach_body(self):
        self.add_triple("?country","wdt:P31","wd:{}".format(self._SOVEREIGN_STATE))
        self.add_union("?country wdt:P361 ?item. ?item wdt:P31 wd:Q82794.","?item wdt:P31 wd:Q5107.")
        self.add_filter("?item not in (wd:Q2)")
        
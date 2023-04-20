from ..QueryBuilder import QueryBuilder

class WikiPediaLinkQuery(QueryBuilder):
    """
    Query for obtaining link to wikipedia of collectible, if there exists data about that on wikidata.

    """
    def __init__(self,collectible_Qnumber : str):
        super().__init__()

        self._collectible = collectible_Qnumber
        self._language = 'en'

        self.set_distinct(True)
        self.add_variable_into_select("?article")

    def set_language(self,language : str):
        """
        Sets language of desire wikipedia article, which will be asked to wikidata.
        """
        self._language = language

    def build_where_body(self):
        
        self.add_triple("?article","schema:about","wd:{}".format(self._collectible))
        self.add_triple("?article","schema:isPartOf","<https://{}.wikipedia.org/>".format(self._language))
        self.add_label_servise()
        
    
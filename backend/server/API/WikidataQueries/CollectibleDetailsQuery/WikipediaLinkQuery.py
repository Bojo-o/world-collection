from ..QueryBuilder import QueryBuilder

class WikiPediaLinkQuery(QueryBuilder):
    def __init__(self,collectible_Qnumber : str):
        super().__init__()

        self._collectible = collectible_Qnumber
        self._language = 'en'

        self.set_distinct(True)
        self.add_variable_into_select("?article")

    def set_language(self,language : str):
        self._language = language

    def build_where_body(self):
        
        self.add_triple("?article","schema:about","wd:{}".format(self._collectible))
        self.add_triple("?article","schema:isPartOf","<https://{}.wikipedia.org/>".format(self._language))
        self.add_label_servise()
        
    
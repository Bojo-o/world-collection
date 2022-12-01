class WikiPediaLinkQuery:
    def __init__(self,q_number : str):
        self._q_number = q_number
        self._language = 'en'
    def set_language(self,language : str):
        self._language = language
    def build(self) -> str:
        query = '''SELECT ?link 
                    WHERE {
                        ?link schema:about wd:%s .
                        ?link schema:isPartOf <https://%s.wikipedia.org/>.

                        SERVICE wikibase:label {
                        bd:serviceParam wikibase:language "en"
                    }
                }''' % (self._q_number,self._language)
        return query


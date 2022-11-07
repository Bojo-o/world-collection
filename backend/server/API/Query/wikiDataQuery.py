from . import q_number_provider

class WikiDataQuery:
    def __init__(self,poi : str):
        self._poi = poi
        self._qnumber_provider = q_number_provider.qnumber_provider()
        self._country = None
    def set_country(self,country : str):
        self._country = country
    def build(self) -> str:
        qnumber = self._qnumber_provider.get_qnumber(self._poi)
        if qnumber is None:
            return None
        str_list = []
        str_list.append("SELECT ?item ?itemLabel ?geo")
        str_list.append("WHERE {")

        str_list.append("   ?item wdt:P31 wd:{}.".format(qnumber))
        str_list.append("   ?item wdt:P625 ?geo.")

        str_list.append("SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }}    ")
        return '\n'.join(str_list)


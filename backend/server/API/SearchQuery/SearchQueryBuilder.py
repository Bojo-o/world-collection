class SearchQueryBuilder:
    def __init__(self,entity_search_name : str):
        self._entity_search_name = entity_search_name
        self._parent_classes_set = set()
    def set_parent_class(self,class_Qnumber : str):
        self._parent_classes_set.add(class_Qnumber)
    def build(self) -> str:
        _service_mwapi = """SERVICE wikibase:mwapi 
        { bd:serviceParam wikibase:endpoint "www.wikidata.org";
        wikibase:api "EntitySearch"; mwapi:search "%s"; mwapi:language "en".
        ?item wikibase:apiOutputItem mwapi:item. ?num wikibase:apiOrdinal true.}""" % (self._entity_search_name)

        str_parent_classes_list = []
        for item in self._parent_classes_set:
            str_parent_classes_list.append(item + " ")

        str_parent_classes = "" . join(str_parent_classes_list)

        #init empty query text 
        query = []

        query.append("SELECT DISTINCT  ?item ?itemLabel ?description")
        query.append("WHERE {")
        query.append("   " + _service_mwapi)

        query.append("   VALUES ?parentClass { " + str_parent_classes + " }")
        query.append("   ?item wdt:P279* ?parentClass.")
        query.append("   hint:Prior hint:gearing \"forward\".")

        query.append("   ?item schema:description ?description.")
        query.append("   FILTER ( lang(?description) = \"en\" )")
        query.append("   SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }")
        query.append("} ORDER BY ASC(?num)")

        # join query and return it
        return '\n'.join(query)
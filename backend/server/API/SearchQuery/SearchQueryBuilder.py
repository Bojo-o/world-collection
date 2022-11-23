class SearchQueryBuilder:
    def __init__(self,entity_search_name : str):
        self._entity_search_name = entity_search_name
        self._parent_classes_set = set()
        self._minus_parent_classes_set = set()
        self._instances = False

    def set_parent_class(self,class_Qnumber : str):
        self._parent_classes_set.add(class_Qnumber)

    def set_minus_parent_class(self,class_Qnumber : str):
        self._minus_parent_classes_set.add(class_Qnumber)

    def set_searing_for_instances(self):
        self._instances = True
    
    def __construct_classification(self, append_list : list , values : str ):
        append_list.append("   VALUES ?parentClass { " + values + " }")
        append_list.append("   ?item {0}wdt:P279* ?parentClass.".format("wdt:P31/" if self._instances else ""))
        append_list.append("   hint:Prior hint:gearing \"forward\".")

    def __convert_set_to_text(self,set : set):
        list = []
        for item in set:
            list.append(item + " ")
        return "" . join(list)

    def build(self) -> str:
        _service_mwapi = """SERVICE wikibase:mwapi 
        { bd:serviceParam wikibase:endpoint "www.wikidata.org";
        wikibase:api "EntitySearch"; mwapi:search "%s"; mwapi:language "en".
        ?item wikibase:apiOutputItem mwapi:item. ?num wikibase:apiOrdinal true.}""" % (self._entity_search_name)

        #str_parent_classes_list = []
        #for item in self._parent_classes_set:
        #    str_parent_classes_list.append(item + " ")
        #
        #str_parent_classes = "" . join(str_parent_classes_list)

        #init empty query text 
        query = []

        query.append("SELECT DISTINCT  ?item ?itemLabel ?description")
        query.append("WHERE {")
        query.append("   " + _service_mwapi)

        #query.append("   VALUES ?parentClass { " + str_parent_classes + " }")
        #query.append("   ?item {0}wdt:P279* ?parentClass.".format("wdt:P31/" if self._instances else ""))
        #query.append("   hint:Prior hint:gearing \"forward\".")
        
        self.__construct_classification(query,self.__convert_set_to_text(self._parent_classes_set))

        if len(self._minus_parent_classes_set) != 0:
            query.append("  MINUS{")
            self.__construct_classification(query,self.__convert_set_to_text(self._minus_parent_classes_set))
            query.append("  }")

        query.append("   ?item schema:description ?description.")
        query.append("   FILTER ( lang(?description) = \"en\" )")
        query.append("   SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }")
        query.append("} ORDER BY ASC(?num)")

        # join query and return it
        return '\n'.join(query)
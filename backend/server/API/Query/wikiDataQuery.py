
class WikiDataQueryBuilder:
    def __init__(self,child_of_class_q_number : str):
        self._classes = set()
        self._classes.add(child_of_class_q_number)
        self._minus_classes = set()
        self._location = set()
        self._minus_location = set()

    def add_child_of_class(self,child_of_class_q_number : str):
        self._classes.add(child_of_class_q_number)

    def add_minus_child_of_class(self,child_of_class_q_number : str):
        self._minus_classes.add(child_of_class_q_number)

    def add_location(self,location_q_number : str):
        self._location.add(location_q_number)

    def add_minus_location(self,location_q_number : str):
        self._minus_location.add(location_q_number)

    def __convert_set(self,set : set):
        list = []
        for item in set:
            list.append("wd:" + item + " ")
        return "" . join(list)

    def __build_predicate(self,query : list,values : str,name : str,predicate : str, minus_flag : bool = False , forward_hint_flag : bool = False):
        name = "?" + name
        if (minus_flag):
            name += "Minus"
            query.append("MINUS {")

        query.append("  VALUES %s { %s }" % (name,values))
        query.append("  ?item %s %s." % (predicate,name))
        if (forward_hint_flag):
            query.append("  hint:Prior hint:gearing \"forward\".")

        if (minus_flag):
            query.append("}")

    
    def build(self) -> str:
        query = []
        query.append("SELECT DISTINCT ?item ?itemLabel (SAMPLE(?geo) AS ?coord) (GROUP_CONCAT( DISTINCT ?instanceLabel;separator=\"/\") AS ?instancesResult)")
        query.append("WHERE {")

        # instance/subclass of classes provided
        self.__build_predicate(query,self.__convert_set(self._classes),"parentClasses","wdt:P31/wdt:P279*")
        # add minus instance/subclass if provided
        if len(self._minus_classes) != 0:
            self.__build_predicate(query,self.__convert_set(self._minus_classes),"parentClasses","wdt:P31/wdt:P279*",True)

        # restricts location of item
        self.__build_predicate(query,self.__convert_set(self._location),"location","wdt:P131*",False, True)

        # add minus location if provided
        if len(self._minus_location) != 0:
            self.__build_predicate(query,self.__convert_set(self._minus_location),"location","wdt:P131*",True, True)

        # get item coordinates property
        query.append("  ?item wdt:P625 ?geo.")

        # get item instance of property
        query.append("  ?item wdt:P31 ?instances.")


        # add service for label 
        query.append("""    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". ?instances rdfs:label ?instanceLabel .?item rdfs:label ?itemLabel .}""")

        # end and group by
        query.append("} group by ?item ?itemLabel ")

        return '\n'.join(query)


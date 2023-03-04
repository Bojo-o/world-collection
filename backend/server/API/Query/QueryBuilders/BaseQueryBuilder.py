from abc import ABC,abstractmethod

class QueryBaseBuilder(ABC):
    def __init__(self,super_class_Qnumber : str) -> None:
        self._super_class = super_class_Qnumber
        self._class_exceptions = set()
        self._query = []

    def __append_header(self):
        self._query.append("SELECT DISTINCT ?collectible ?collectibleLabel (SAMPLE(?geo) AS ?coord) (GROUP_CONCAT( DISTINCT ?instancesLabel;separator=\"/\") AS ?isInstanceOf)")
        self._query.append("WHERE {")

    def __append_footer(self):
        # get instances
        self._query.append("?collectible wdt:P31 ?instances.")
        # add service for label 
        self._query.append("""SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". ?instances rdfs:label ?instancesLabel .?collectible rdfs:label ?collectibleLabel .}""")
        # end and group by
        self._query.append("} group by ?collectible ?collectibleLabel ")

    def convert_set(self,set : set):
        list = []
        for item in set:
            list.append("wd:" + item + " ")
        return "" . join(list)

    def add_class_exception(self,Qnumber_of_class: str):
        self._class_exceptions.add(Qnumber_of_class)
    
    def __append_class_exceptions(self):
        if self._class_exceptions.__len__ == 0 :
            return
        self._query.append("MINUS {VALUES ?classExceptions { " + self.convert_set(self._class_exceptions) + " } ?collectible wdt:P31/wdt:P279* ?classExceptions .}")
    def build(self) -> str:
        self._query.clear()
        self.__append_header()
        self._inner_build()
        self.__append_class_exceptions()
        self.__append_footer()

        return '\n'.join(self._query)

    @abstractmethod
    def _inner_build(self):
        pass


class  EntityDetailsQueryBuilder:
    def __init__(self,entity_q_number : str):
        self._entity_q_number = entity_q_number
        self._properties = set()
    def add_property(self,property_p_number : str):
        self._properties.add(property_p_number)
    def __convert_properties(self):
        list = []
        for item in self._properties:
            list.append("(p:" + item + ")")
        return "" . join(list)
    def build(self) -> str:
        query =  ''' SELECT (?wdLabel AS ?statement) (GROUP_CONCAT( DISTINCT ?valueLabel;separator="</>") AS ?value) WHERE{
                        VALUES (?item) {(%s)}
                        VALUES (?statments) {%s}
                        
                        ?item ?statments ?statement .

                        ?statement ?ps ?valueTemp .
                        ?statement rdf:type wikibase:BestRank.
                        
                        ?wd wikibase:claim ?p.
                        ?wd wikibase:statementProperty ?ps.
                        
                        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". ?wd rdfs:label ?wdLabel.  ?valueTemp rdfs:label ?valueLabel . }
                    } group by ?wdLabel''' % ('wd:' + self._entity_q_number,self.__convert_properties())
        return query
from ..QueryBuilder import QueryBuilder

class CollectibleDetailsQuery(QueryBuilder):
    """
    Query for obtaining all details of collectible, which are related to specific categories or values of details are of a certain supported type.   

    """
    def __init__(self,collectible_Qnumber : str):
        super().__init__()

        self._collectible = collectible_Qnumber

        self.set_distinct(True)
        self.add_variable_into_select("?property")
        self.add_variable_into_select("?dataType")
        self.add_variable_into_select("GROUP_CONCAT( DISTINCT ?valueLabel ;separator=\"<space>\")","?values")
        self.add_variable_into_select("?timePrecision")
        self.add_variable_into_select("?unit")

        self.add_group_by_("?property")
        self.add_group_by_("?dataType")
        self.add_group_by_("?timePrecision")
        self.add_group_by_("?unit")

        self._supported_data_type = set()
        self._supported_data_type.add("Quantity")
        self._supported_data_type.add("Time")
        self._supported_data_type.add("WikibaseItem")
        self._supported_data_type.add("Url")
        self._supported_data_type.add("Monolingualtext")

        self._property_exception = set()
        self._property_exception.add("P150")
        self._property_exception.add("P190")
        self._property_exception.add("P355")
        self._property_exception.add("P31")
        self._property_exception.add("P131")
        self._property_exception.add("P1383")

    def build_where_body(self):
        self.add_triple("wd:{}".format(self._collectible),"?p","?statement")
        self.add_triple("?statement","rdf:type","wikibase:BestRank")
        self.add_triple("?statement","?ps","?ps_")

        self.add_triple("?wd","wikibase:claim","?p")
        self.add_triple("?wd","wikibase:statementProperty","?ps")
        self.add_triple("?wd","wikibase:statementValue","?psv")

        self.define_values_variable("?supportedDataTypes",self._supported_data_type,"wikibase:")
        self.add_triple("?wd","wikibase:propertyType","?supportedDataTypes")
        self.filter_wrapper("?wd not in ({})".format(self.convert_set(self._property_exception,", wd:")[1:]))

        self.add_triple("?wd","wikibase:propertyType","?dataType")
        self.add_triple("?statement","?ps","?value")

        self.optional_wrapper("?statement ?psv [wikibase:timePrecision  ?timePrecision].")
        self.optional_wrapper("?statement ?psv [wikibase:quantityUnit  ?unitValue].")

        self.add_label_servise("?wd rdfs:label ?property . ?value rdfs:label ?valueLabel. ?unitValue rdfs:label ?unit.")
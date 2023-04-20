from ..QueryBuilder import QueryBuilder

class FilterSearchQueryBuilder(QueryBuilder):
    '''
    It searchs for all filters, which are related to provided type/class, that means for example for castle class it search for properties related to castle class objects.
    Then we will said, that this filters are recomended for provided class.
    In project we also, support using for each class albitraly filter.
    If type is not set by method, then it search for all possible filters.
    (Hovewer, this query takes long time to be done for all filters, so we fetched it once and stores that values into json. When the fronted requires all filters, we will send this json.)
    '''
    def __init__(self) -> None:
        super().__init__()

        self.set_distinct(True)

        self.add_variable_into_select("?property","?PNumber",True,"?name")
        self.add_variable_into_select("?dataType")
        self.add_variable_into_select("?description")

        self._type_for_search_filter = None

        self._super_classes = set()
        self._super_classes.add("Q2221906")

        self._property_exception = set()
        self._property_exception.add("P17")
        self._property_exception.add("P131")

        self._supported_data_type = set()
        self._supported_data_type.add("Quantity")
        self._supported_data_type.add("Time")
        self._supported_data_type.add("WikibaseItem")


    def set_type_for_search_filter(self,Qnumber_of_type : str):
        '''
        Sets a type, for which it will search for recomended filters.
        '''
        self._type_for_search_filter = Qnumber_of_type

    def build_where_body(self):
        if self._type_for_search_filter is None:
            self.define_values_variable("?all",self._super_classes,"wd:")
            self.add_triple("?classes","wdt:P279*","?all")
        else:
            self.add_triple("wd:{}".format(self._type_for_search_filter),"wdt:P279*","?classes")

        self.define_values_variable("?superClasses",self._super_classes,"wd:")
        self.add_triple("?classes","wdt:P279*","?superClasses")
        self.add_gearing_forward_hint()

        self.add_triple("?classes","wdt:P1963","?property")
        self.filter_wrapper("?property not in ({})".format(self.convert_set(self._property_exception,", wd:")[1:]))

        self.define_values_variable("?supportedDataTypes",self._supported_data_type,"wikibase:")
        self.add_triple("?property","wikibase:propertyType","?supportedDataTypes")
        self.add_triple("?property", "wikibase:propertyType" ,"?dataType")

        self.add_triple("?property","schema:description","?description")
        self.filter_wrapper("lang(?description) = \"en\"")

        self.add_label_servise()
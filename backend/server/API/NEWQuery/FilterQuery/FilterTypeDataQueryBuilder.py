from enum import Enum
from ..QueryBuilder import QueryBuilder


class DATATYPES(Enum):
    QUANTITY = "Quantity"
    TIME = "Time"
    WIKIBASEITEM = "Item"

class FilterTypeDataQueryBuilder(QueryBuilder):
    def __init__(self,property_Pnumber : str,data_type_of_property : DATATYPES):
        super().__init__()
        self._property : str = property_Pnumber
        self._data_type : DATATYPES = data_type_of_property

        self.select_variable("?item","?QNumber",True,"?name")

        self._PROPERTY_CONSTRAINT = "P2302"
        self._VALUE_TYPE_CONSTRAINT = "Q21510865"
        self._QUALIFIER_CLASS = "P2308"

    def build_where_body(self):
        match self._data_type:
            case DATATYPES.WIKIBASEITEM:
                self.add_triple("wd:{}".format(self._property),"p:{}".format(self._PROPERTY_CONSTRAINT),"?node")
                self.add_triple("?node","ps:{}".format(self._PROPERTY_CONSTRAINT),"wd:{}".format(self._VALUE_TYPE_CONSTRAINT))
                self.add_triple("?node","pq:{}".format(self._QUALIFIER_CLASS),"?item")
        
        self.add_label_servise()
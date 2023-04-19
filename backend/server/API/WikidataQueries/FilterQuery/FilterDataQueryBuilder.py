from enum import Enum
from ..QueryBuilder import QueryBuilder


class DATATYPES(Enum):
    QUANTITY = "Quantity"
    TIME = "Time"
    WIKIBASEITEM = "Item"

class PROPERTY_CONSTRAINT_TYPE(Enum):
    ONE_OF_CONSTRAINT = "Q21510859" #item of property constraint
    VALUE_TYPE_CONSTRAINT = "Q21510865" #relation , class
    NONE_OF_CONSTRAINT = "Q52558054" # #item of property constraint
    CONFLICT_WITH_CONSTRAINT = "Q21502838" # property, item of property constraint

    ALLOWED_UNITS_CONSTRAINT = "Q21514353"
    RANGE_CONSTRAINT = "Q21510860"

class FilterDataQueryBuilder(QueryBuilder):
    def __init__(self,property_Pnumber : str,data_type_of_property : DATATYPES,property_constraint_type : PROPERTY_CONSTRAINT_TYPE):
        super().__init__()

        self._property : str = property_Pnumber
        self._data_type : DATATYPES = data_type_of_property
        self._property_constraint_type = property_constraint_type

        if property_constraint_type == PROPERTY_CONSTRAINT_TYPE.RANGE_CONSTRAINT:
            self.add_variable_into_select("?max")
            self.add_variable_into_select("?min")
        else:
            self.add_variable_into_select("?item","?QNumber",True,"?name")

        if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.VALUE_TYPE_CONSTRAINT or self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.CONFLICT_WITH_CONSTRAINT:
            self.add_variable_into_select("?rel","?relationQNumber",True,"?relation")

        self._PROPERTY_CONSTRAINT = "P2302"
        self._QUALIFIER_CLASS = "P2308"
        self._QUALIFIER_RELATION = "P2309"
        self._ITEM_OF_PROPERTY_CONSTRAINT = "P2305"
        self._QUALIFIER_PROPERTY = "P2306"

        self._QUALIFIER_MINIMUM_VALUE = "P2313"
        self._QUALIFIER_MAXIMUM_VALUE = "P2312"

    def build_where_body(self):
        self.add_triple("wd:{}".format(self._property),"p:{}".format(self._PROPERTY_CONSTRAINT),"?node") #
        self.add_triple("?node","ps:{}".format(self._PROPERTY_CONSTRAINT),"wd:{}".format(self._property_constraint_type.value)) #

        match self._data_type:
            case DATATYPES.WIKIBASEITEM:
                self.add_triple("?node","pq:{}".format(self._QUALIFIER_CLASS if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.VALUE_TYPE_CONSTRAINT else self._ITEM_OF_PROPERTY_CONSTRAINT),"?item")
                if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.VALUE_TYPE_CONSTRAINT:
                    self.add_triple("?node","pq:{}".format(self._QUALIFIER_RELATION),"?rel")
                if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.CONFLICT_WITH_CONSTRAINT:
                    self.add_triple("?node","pq:{}".format(self._QUALIFIER_PROPERTY),"?rel")
            case DATATYPES.QUANTITY:
                if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.ALLOWED_UNITS_CONSTRAINT:
                    self.add_triple("?node","pq:{}".format(self._ITEM_OF_PROPERTY_CONSTRAINT),"?item")
                if self._property_constraint_type == PROPERTY_CONSTRAINT_TYPE.RANGE_CONSTRAINT:
                    self.add_triple("?node","pq:{}".format(self._QUALIFIER_MINIMUM_VALUE),"?min")
                    self.add_triple("?node","pq:{}".format(self._QUALIFIER_MAXIMUM_VALUE),"?max")
        self.add_label_servise()
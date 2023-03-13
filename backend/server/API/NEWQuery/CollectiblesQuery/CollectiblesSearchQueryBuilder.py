from abc import ABC, abstractmethod
from ..QueryBuilder import QueryBuilder
from.FiltersData.WikibaseItemFilterData import WikibaseItemFilterData
from .FiltersData.TimeFilterData import TimeFilterData
from .FiltersData.ComparisonOperators import ComparisonOperators
from .FiltersData.QuantityFilterData import QuantityFilterData

class CollectiblesSearchQueryBuilder(QueryBuilder,ABC):
    def __init__(self,parent_class : str):
        super().__init__()

        self._parent_class = parent_class

        self._exception_classes = set()


        self._item_filters = []
        self._time_filters = []
        self._quantity_filters = []

        self.select_variable("?item","?QNumber",True,"?name")

        self._INSTANCE_OR_SUBCLASS =  "wdt:P31/wdt:P279*"

    def build_statement(self,object : str,value_name : str,predicate : str,values : set,add_hint = False, minus_flag = False,):
        if minus_flag:
            self._query.append("MINUS{")

        self.define_values_variable(value_name,values,"wd:")
        self.add_triple(object,predicate,value_name)

        if add_hint:
            self.add_hint()

        if minus_flag:
            self._query.append("}")

    def add_class_exception(self, Qnumber_of_class: str):
        self._exception_classes.add(Qnumber_of_class)

    def build_class_restriction(self):
        self.add_triple("?item",self._INSTANCE_OR_SUBCLASS,"wd:{}".format(self._parent_class))

        if self._exception_classes.__len__() != 0:
            self.build_statement("?item","?exceptionClasses",self._INSTANCE_OR_SUBCLASS,self._exception_classes,False,True)

    def add_item_filter(self,property: str,value_Qnumber : str):
        filter = WikibaseItemFilterData(property,value_Qnumber)
        self._item_filters.append(filter)

    def add_time_filter(self,property : str,comparison_operator : ComparisonOperators, time_value : str):
        filter = TimeFilterData(property,comparison_operator,time_value)
        self._time_filters.append(filter)

    def add_quantity_filter(self,property : str,comparison_operator : ComparisonOperators, quantity_value : str,value_in_unit : str = None):
        filter = QuantityFilterData(property,comparison_operator,quantity_value,value_in_unit)
        self._quantity_filters.append(filter)

    def build_where_body(self):
        
        self.build_class_and_location_restriction()

        for itemFilter  in self._item_filters:
            item : WikibaseItemFilterData = itemFilter
            self.add_filter_exist("?item wdt:{} wd:{} .".format(item.property,item.value))

        i = 0
        for timeFilter in self._time_filters:
            time : TimeFilterData = timeFilter
            temp_name = "?timeFilterTemp{}".format(i)
            self.add_triple("?item","wdt:{}".format(time.property),temp_name)
            self.add_filter("\"{}\"^^xsd:dateTime {} {} ".format(time.date_value,time.comparison_operator.value,temp_name))
            i = i + 1
        
        j = 0
        for quantityFilter in self._quantity_filters:
            quantity : QuantityFilterData = quantityFilter
            temp_name = "?quantityFilterTemp{}".format(i)

            
            unit = quantity.value_in_unit
            if unit is None:  
                self.add_triple("?item","wdt:{}".format(quantity.property),temp_name)
                self.add_filter("{} {} {}".format(str(quantity.quantity_value),quantity.comparison_operator.value,temp_name))
            else:
                self.add_triple("wd:{}".format(unit),"wdt:P2370",temp_name + "conversion")
                self.add_triple("?item","p:{}/psn:{}/wikibase:quantityAmount ".format(quantity.property,quantity.property),temp_name)
                self.add_filter("({} * {}) {} {}".format(str(quantity.quantity_value),temp_name + "conversion",quantity.comparison_operator.value,temp_name))
            j = j + 1
        self.add_label_servise()

    @abstractmethod
    def build_class_and_location_restriction(self):
        pass
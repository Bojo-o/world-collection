from abc import ABC, abstractmethod
from ..QueryBuilder import QueryBuilder
from.FiltersData.WikibaseItemFilterData import WikibaseItemFilterData
from .FiltersData.TimeFilterData import TimeFilterData
from .FiltersData.ComparisonOperators import ComparisonOperator
from .FiltersData.QuantityFilterData import QuantityFilterData

class CollectiblesSearchQueryBuilder(QueryBuilder,ABC):
    '''
    Abstract class, which contains mechanism for searching collectibles on Wikidata.
    It contains mechanism for filtering collectibles with filter data, getting data of collectible such as coordinates , which instance of class are they...
    Contains `build_class_and_location_restriction` method , which must be overrided by inherited classes. In this method every inherited class must implement its own mechanism
    for selecting collectible by class and location restriction.
    '''
    def __init__(self,parent_class : str):
        super().__init__()

        self._parent_class = parent_class
        self._ANYTHING = "Q2221906"

        self._exception_classes = set()

        self._item_filters = []
        self._time_filters = []
        self._quantity_filters = []

        self.set_distinct(True)

        self.add_variable_into_select("?item","?QNumber",True,"?name")
        self.add_variable_into_select("SAMPLE(?lat)","?lati")
        self.add_variable_into_select("SAMPLE(?lon)","?long")
        self.add_variable_into_select("GROUP_CONCAT( DISTINCT ?instancesLabel;separator=\"/\")","?subTypeOf")

        self.add_group_by_("?item")
        self.add_group_by_("?itemLabel")

        self._INSTANCE_OR_SUBCLASS =  "wdt:P31/wdt:P279*"

    def add_class_exception(self, Qnumber_of_class: str):
        '''
        Adds into query class exception, meaning that, found collectibles will not be instances of this exception class.
        '''
        self._exception_classes.add(Qnumber_of_class)

    def build_class_restriction(self):
        '''
        Joins into query mechanism for filtering collectibles, which are instances of desired classes.(are instances of parent class and are not instances of exceptions classes)
        If parent class is not set, it set as parent class "ANYTHING" representing that, collectible is instance of `geographic location`.

        Wikidata
        --------
        `geographic location`  - point or an area on something's surface or elsewhere
        '''
        if self._parent_class != self._ANYTHING:
            self.add_triple("?item",self._INSTANCE_OR_SUBCLASS,"wd:{}".format(self._parent_class))
        

        if self._exception_classes.__len__() != 0:
            self.restriction_wrapper("?item","?exceptionClasses",self._INSTANCE_OR_SUBCLASS,self._exception_classes,False,True)

    def add_item_filter(self,property: str,value_QNumber : str):
        '''
        Adds into query restriction for applying `WikibaItem` filter on collectibles.

        Parameters
        ----------
        property : str
            PNumber of property/filter.
        value_QNumber : str
            Value QNumber of property/filter. Since value is `WikibaseItem`, meaning it has it QNumber on Wikidata.
        
        ''' 
        filter = WikibaseItemFilterData(property,value_QNumber)
        self._item_filters.append(filter)

    def add_time_filter(self,property : str,comparison_operator : ComparisonOperator, time_value : str):
        '''
        Adds into query restriction for applying `Time` filter on collectibles.

        Parameters
        ----------
        property : str
            PNumber of property/filter.
        comparison_operator : ComparisonOperator
            Comparison operator, which will be used for filtering collectibles.
            Provided value <comparison operator> Collectibles Value of that property/filter.
        time_value : str
            Value in timestamp string format, representing date format, which Wikidata recognize and used.

        Wikidata
        --------
        Visit site about time format : https://www.wikidata.org/wiki/Help:Dates
        ''' 
        filter = TimeFilterData(property,comparison_operator,time_value)
        self._time_filters.append(filter)

    def add_quantity_filter(self,property : str,comparison_operator : ComparisonOperator, quantity_value : int,value_in_unit_QNumber : str = None):
        '''
        Adds into query restriction for applying `Quantity` filter on collectibles.

        Parameters
        ----------
        property : str
            PNumber of property/filter.
        comparison_operator : ComparisonOperator
            Comparison operator, which will be used for filtering collectibles.
            Provided value <comparison operator> Collectibles Value of that property/filter.
        quantity_value : int
            Value, which will be used in filtering for comparison.
        value_in_unit_QNumber : str [optional, default None]
            QNumber of unit, in which is setted provided value.

        '''
        filter = QuantityFilterData(property,comparison_operator,quantity_value,value_in_unit_QNumber)
        self._quantity_filters.append(filter)

    def build_where_body(self):

        for itemFilter  in self._item_filters:
            item : WikibaseItemFilterData = itemFilter
            self.add_triple("?item", "wdt:{}".format(item.property),"wd:{}".format(item.value))

        self.build_class_and_location_restriction()

        i = 0
        for timeFilter in self._time_filters:
            time : TimeFilterData = timeFilter
            temp_name = "?timeFilterTemp{}".format(i)
            self.add_triple("?item","wdt:{}".format(time.property),temp_name)
            self.filter_wrapper("\"{}\"^^xsd:dateTime {} {} ".format(time.date_value,time.comparison_operator.value,temp_name))
            i = i + 1
        
        j = 0
        for quantityFilter in self._quantity_filters:
            quantity : QuantityFilterData = quantityFilter
            temp_name = "?quantityFilterTemp{}".format(i)

            
            unit = quantity.value_in_unit
            if unit is None:  
                self.add_triple("?item","wdt:{}".format(quantity.property),temp_name)
                self.filter_wrapper("{} {} {}".format(str(quantity.quantity_value),quantity.comparison_operator.value,temp_name))
            else:
                self.add_triple("wd:{}".format(unit),"wdt:P2370",temp_name + "conversion")
                self.add_triple("?item","p:{}/psn:{}/wikibase:quantityAmount ".format(quantity.property,quantity.property),temp_name)
                self.filter_wrapper("({} * {}) {} {}".format(str(quantity.quantity_value),temp_name + "conversion",quantity.comparison_operator.value,temp_name))
            j = j + 1

        # get item coordinates property
        self.get_coordinates_of_object("?item")
        # get item instance of property
        self.add_triple("?item","wdt:P31", "?instances")

        self.add_label_servise("?instances rdfs:label ?instancesLabel .")

    @abstractmethod
    def build_class_and_location_restriction(self):
        """
        Method for overriding in inherited objects.
        Made for implementing class and location restriction on collectibles in query.
        """
        pass
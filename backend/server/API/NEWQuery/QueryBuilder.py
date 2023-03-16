from abc import ABC, abstractmethod

class QueryBuildeException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class QueryBuilder(ABC):
    def __init__(self):
        self._query = []
        self._select_variables = set()
        self._select_variable_label = set()
        self._distinct_flag = False
        self._order_by_variables = set()
        self._group_by_variables = set()

    def convert_set(self,set : set,prefix : str = ""):
        list = []
        for item in set:
            list.append(prefix + item + " ")
        return "" . join(list)
    
    def set_distinct(self,flag : bool):
        self._distinct_flag = flag

    def select_variable(self,variable : str,name_as : str = None,with_label_flag : bool = False,name_label_as : str = None):
        self._select_variables.add(variable if name_as is None else "({} AS {})".format(variable,name_as))
        if with_label_flag:
            self._select_variable_label.add(variable)
            self._select_variables.add(variable+"Label" if name_as is None else "({} AS {})".format(variable+"Label",name_as + "Label" if name_label_as is None else name_label_as))
    
    def add_order_by_(self,variable : str):
        self._order_by_variables.add(variable)

    def add_group_by_(self,variable : str):
        self._group_by_variables.add(variable)

    def add_triple(self,subject : str,predicate : str,object :str):
        self._query.append("{} {} {} .".format(subject,predicate,object))

    def define_values_variable(self,variable_name : str,values : set,values_prefix : str = ""):
        self._query.append(" VALUES " + variable_name + " {" + self.convert_set(values,values_prefix) + " }")

    def add_service(self,service : str,body : str):
        self._query.append("SERVICE {} ".format(service) + "{ " + body + " }")

    def add_label_servise(self,additional_body : str = None):
        add_body : str = "" if additional_body is None else additional_body
        temp  = []
        for variable  in self._select_variable_label:
            temp.append(" {} rdfs:label {} .".format(variable,variable + "Label"))
        self.add_service("wikibase:label","bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\"." + "" . join(temp) + add_body)
        

    def add_hint(self):
        self._query.append("hint:Prior hint:gearing \"forward\".")

    def add_filter_exist(self,body : str):
        self._query.append("FILTER EXISTS {" + body + "}")
    
    def add_filter(self,body : str):
        self._query.append("FILTER ({})".format(body))

    def get_coordinates_of_object(self,object : str):
        self.add_triple(object,"p:P625","?coord")
        self.add_triple("?coord","psv:P625","?coord_node")
        self.add_triple("?coord_node","wikibase:geoLongitude","?lon")
        self.add_triple("?coord_node","wikibase:geoLatitude","?lat")
    
    def __build_select(self):
        if self._query.__len__() != 0 :
            raise QueryBuildeException("SELECT must be call as the first")
        
        self._query.append("SELECT {} {}".format("DISTINCT" if self._distinct_flag else "",self.convert_set(self._select_variables),))
        self._query.append("WHERE {")

    def __build_footer(self):
        if self._order_by_variables.__len__() != 0:     
            self._query.append("} ORDER BY " + self.convert_set(self._order_by_variables))
            return
        if self._group_by_variables.__len__() != 0:
            self._query.append("} GROUP BY " + self.convert_set(self._group_by_variables))
            return
        self._query.append("}")

    def build(self) -> str:
        self._query.clear()

        self.__build_select()

        self.build_where_body()

        self.__build_footer()

        return '\n'.join(self._query)

    @abstractmethod
    def build_where_body(self):
        pass

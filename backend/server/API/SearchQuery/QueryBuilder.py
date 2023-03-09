from abc import ABS, abstractmethod

class QueryBuildeException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class QueryBuilder(ABS):
    def __init__(self):
        self._query = []
        self._select_variables = set()
        self._order_by_variables = set()

    def convert_set(self,set : set,prefix : str = ""):
        list = []
        for item in set:
            list.append(prefix + item + " ")
        return "" . join(list)
    
    def select_variable(self,variable : str,with_label_flag : bool = False):
        self._select_variables.add(variable)
        if with_label_flag:
            self._select_variables.add(variable+"Label")
    
    def add_order_by_(self,variable : str):
        self._order_by_variables.add(variable)

    def add_triple(self,subject : str,predicate : str,object :str):
        self._query.append("{} {} {} .".format(subject,predicate,object))

    def define_values_variable(self,variable_name : str,values : set):
        self._query.append(" VALUES " + variable_name + " {" + self.convert_set(values) + " }")

    def add_service(self,service : str,body : str):
        self._query.append("SERVICE {} ".format(service) + "{ " + body + " }")

    def add_hint(self):
        self._query.append("hint:Prior hint:gearing \"forward\".")

    def add_filter(self,body : str):
        self._query.append("FILTER ({})".format(body))

    def __build_select(self,distinct_flag : bool = True):
        if self._query.__len__() != 0 :
            raise QueryBuildeException("SELECT must be call as the first")
        
        self._query.append("SELECT {} {}".format("DISTINCT" if distinct_flag else "",self.convert_set(self._select_variables),))
        self._query.append("WHERE {")

    def __build_footer(self):
        self._query.append("} {}".format("ORDER BY " + self.convert_set(self._order_by_variables) if self._order_by_variables.__len__() != 0 else ""))

    def build(self) -> str:
        self._query.clear()

        self.__build_select()

        self.build_where_body()

        self.__build_footer

        return '\n'.join(self._query)

    @abstractmethod
    def build_where_body(self):
        pass
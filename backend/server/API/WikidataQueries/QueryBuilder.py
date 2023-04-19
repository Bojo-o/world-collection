from abc import ABC, abstractmethod

class QueryBuildeException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class QueryBuilder(ABC):
    """
    Abstract base query object, used for building Sparql queries for Wikidata.
    Contains base methods for setting select, hints, filters etc..
    It does not contain all Sparql possibilities only theses for building queries, which are used for this project.
    It is necessary to override the "build_where_body" method in the inherited objects.
    """
    def __init__(self):
        self._query = []
        self._select_variables = set()
        self._select_variable_label = set()
        self._distinct_flag = False
        self._order_by_variables = set()
        self._group_by_variables = set()

    def convert_set(self,set : set,prefix : str = ""):
        """
        Help method for converting set into string format.

        Parameters
        -------
        set : set
            The set, which will be converted as string.
        prefix : str [optional]
            Prefix, which will be added in front of each value from set.
            
        """
        list = []
        for item in set:
            list.append(prefix + item + " ")
        return "" . join(list)
    
    def set_distinct(self,flag : bool):
        """
        Set if select should be distinct.

        Parameters
        -------
        flag : bool
            True if query select will be distinct
        """
        self._distinct_flag = flag

    def add_variable_into_select(self,variable : str,name_as : str = None,with_label_flag : bool = False,name_label_as : str = None):
        """
        Adds into select this variable, so then query results will contains data from this variable.

        Parameters
        -------
        variable : str
            Name of variable.
        name_as : str [optional]
            Name, which in result will be referred to this variable.
        with_label_flag : bool [optional]
            Flag, which indicates if this variable should be included in label service.
        name_label_as : str [optional]
            Name of variable, which will contains this variable label data.
        """
        self._select_variables.add(variable if name_as is None else "({} AS {})".format(variable,name_as))
        if with_label_flag:
            self._select_variable_label.add(variable)
            self._select_variables.add(variable+"Label" if name_as is None else "({} AS {})".format(variable+"Label",name_as + "Label" if name_label_as is None else name_label_as))
    
    def add_order_by_(self,variable : str):
        """
        Set this variable, according to which results will be ordered.

        Parameters
        -------
        variable : str
            Name of variable, which must have existed in query.
        
        """
        self._order_by_variables.add(variable)

    def add_group_by_(self,variable : str):
        """
        Set this variable, according to which results will be grouped.

        Parameters
        -------
        variable : str
            Name of variable, which must have existed in query.
        
        """
        self._group_by_variables.add(variable)

    def add_triple(self,subject : str,predicate : str,object :str):
        """
        Adds into query a simple triple, which is base stone of Sparql queries.

        Parameters
        -------
        subject : str
            Subject of the tripe.
        predicate : str
            Predicate of the tripe.
        object : str
            Object of the triple.
        """
        self._query.append("{} {} {} .".format(subject,predicate,object))

    def define_values_variable(self,variable_name : str,values : set,values_prefix : str = ""):
        """
        Create in query a new variable, which holds provided values.

        Parameters
        -------
        variable_name : str
            Name of variable, then it can be approuched by this name in query.
        values: set
            Values, which will be contained in variable.
        values_prefix : str
            Prefix, which will be added before values in variable.
            It serves because different prefix posibilities.
        """
        self._query.append(" VALUES " + variable_name + " {" + self.convert_set(values,values_prefix) + " }")

    def service_wrapper(self,service : str,body : str):
        """
        Wrapper for adding service into query.

        Parameters
        -------
        service : str
            Defined service, which exists for Wikidata sparql.
        body : str
            Body os service, which will be wrapped into service.

        """
        self._query.append("SERVICE {} ".format(service) + "{ " + body + " }")

    def add_label_servise(self,additional_body : str = None):
        """
        Adds into query label service for obtaining labels from Wikidata.
        For a variable added with the "label" flag, this variable is automatically added to the service label.

        Parameters
        -------
        additional_body : str
            Additional body, which will be joined into label service

        """
        add_body : str = "" if additional_body is None else additional_body
        temp  = []
        for variable  in self._select_variable_label:
            temp.append(" {} rdfs:label {} .".format(variable,variable + "Label"))
        self.service_wrapper("wikibase:label","bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\"." + "" . join(temp) + add_body)
        
    def union_wrapper(self,the_first_part : str,the_second_part : str):
        """
        Wrapper for make union of two expressions.

        """
        self._query.append("{ "+ the_first_part +"} UNION { " + the_second_part + "}")
        
    def add_gearing_forward_hint(self):
        """
        Add into query prior hint, which tells to triple above this hint to gearing forward.
        It optimazes speed of query. Use only after triple, where you know it helps to optimaze query.

        """
        self._query.append("hint:Prior hint:gearing \"forward\".")

    def filter_exist_wrapper(self,body : str):
        """
        Helping method for creating filter exists of where part.
        It takes body and wraps it into filter exists expression.

        Parameters
        -------
        body : str
            String representing body of filter exists.
        """
        self._query.append("FILTER EXISTS {" + body + "}")
    
    def filter_wrapper(self,body : str):
        """
        Helping method for creating filter of where part.
        It takes body and wraps it into filter expression.

        Parameters
        -------
        body : str
            String representing body of filter.
        """
        self._query.append("FILTER ({})".format(body))

    def optional_wrapper(self,body : str):
        """
        Helping method for creating optional condition of where.
        It takes body and wraps it into optional expression.

        Parameters
        -------
        body : str
            String representing body of optional condition.
        """
        self._query.append("OPTIONAL {" + body + "}")
        
    def get_coordinates_of_object(self,object : str):
        """
        Method for adding into query mechanism of obtaing coordinates of object.

        Parameters
        -------
        object : str
            variable, from which we want to obtain coordinates.
        """
        self.add_triple(object,"p:P625","?coord")
        self.add_triple("?coord","psv:P625","?coord_node")
        self.add_triple("?coord_node","wikibase:geoLongitude","?lon")
        self.add_triple("?coord_node","wikibase:geoLatitude","?lat")
    
    def __build_select(self):
        """
        Private method for building the first part of query, which is SELECT.
        To add variable to Select "add_variable_into_select" method.

        """
        if self._query.__len__() != 0 :
            raise QueryBuildeException("SELECT must be call as the first")
        
        self._query.append("SELECT {} {}".format("DISTINCT" if self._distinct_flag else "",self.convert_set(self._select_variables),))
        self._query.append("WHERE {")

    def __build_footer(self):
        """
        Private method for building part after where statment.
        Adds ORDER and GROUP BY after statment on the end of query.
        To add something you need call "add_order_by_" or "add_group_by_" methods.
        Not use both of them in one query!
        """
        if self._order_by_variables.__len__() != 0:     
            self._query.append("} ORDER BY " + self.convert_set(self._order_by_variables))
            return
        if self._group_by_variables.__len__() != 0:
            self._query.append("} GROUP BY " + self.convert_set(self._group_by_variables))
            return
        self._query.append("}")

    def build(self) -> str:
        """
        Build Sparql query for Wikidata.

        Returns
        -------
        str
            Sparql query as string.
        """
        self._query.clear()
        self.__build_select()
        self.build_where_body()
        self.__build_footer()
        return '\n'.join(self._query)

    @abstractmethod
    def build_where_body(self):
        """
        Method for overriding  in inherited objects.
        Made for making "Where" part in query.
        """
        pass

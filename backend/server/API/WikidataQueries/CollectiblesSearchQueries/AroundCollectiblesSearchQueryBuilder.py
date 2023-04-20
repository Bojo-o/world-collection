from .CollectiblesSearchQueryBuilder import CollectiblesSearchQueryBuilder

class AroundCollectiblesSearchQueryBuilderException(Exception):
    def __init__(self, message : str) -> None:
        super().__init__(message)

class AroundCollectiblesSearchQueryBuilder(CollectiblesSearchQueryBuilder):
    def __init__(self, parent_class: str):
        super().__init__(parent_class)
        self._center : str|None = None
        self._center_by_coord_flag : bool = False
        self._radius = 1
    def set_center_as_entity(self,Qnumber_of_center : str) -> None:
        self._center = Qnumber_of_center

    def set_center_by_coordinates(self,latitude : float,longitude : float):
        # arguments validation
        if latitude > 90 or latitude < -90:
            raise AroundCollectiblesSearchQueryBuilderException("The latitude parameters range is from -90.0 to 90.0")
        if longitude > 180 or longitude < -180:
            raise AroundCollectiblesSearchQueryBuilderException("The longitude parameters range is from -180.0 to 180.0")

        self._center = "Point({0} {1})".format(longitude,latitude)
        self._center_by_coord_flag = True
    
    def set_radius(self,radius_in_km : int):
        if radius_in_km < 1 or radius_in_km > 500:
            raise AroundCollectiblesSearchQueryBuilderException("The supported radius parameters range is from 1 km to 500 km")
        self._radius = radius_in_km

    def build_class_and_location_restriction(self):
        #check 
        if self._center is None:
            raise AroundCollectiblesSearchQueryBuilderException("The center was not set")

        # add around service
        if self._center_by_coord_flag == False:
            self.add_triple("wd:{0}".format(self._center), "wdt:P625", "?locationOfCenter")

        self.service_wrapper("wikibase:around"," ?item wdt:P625 ?geo . bd:serviceParam wikibase:center "
        + ("\"{}\"^^geo:wktLiteral .".format(self._center) if self._center_by_coord_flag else "?locationOfCenter .")
        +" bd:serviceParam wikibase:radius \""
        + str(self._radius) +"\" .")

        if self._parent_class != self._ANYTHING:
            self.filter_exist_wrapper("?item " + self._INSTANCE_OR_SUBCLASS + " wd:{}".format(self._parent_class))
            
        if self._exception_classes.__len__() != 0:
            self.restriction_wrapper("?item","?exceptionClasses",self._INSTANCE_OR_SUBCLASS,self._exception_classes,False,True)
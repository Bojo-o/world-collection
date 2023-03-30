from ..QueryBuilder import QueryBuilder

class CollectibleBasicInfoQuery(QueryBuilder):
    def __init__(self,collectible_Qnumber : str):
        super().__init__()

        self.select_variable("?desc")
        self.select_variable("SAMPLE(?img)","?image")

        self._collectible = collectible_Qnumber
        self._IMAGE = "P18"

        self.add_group_by_("?desc")

    def build_where_body(self):
        self.add_triple("wd:{}".format(self._collectible),"wdt:{}".format(self._IMAGE),"?img")
        self.add_triple("wd:{}".format(self._collectible),"schema:description","?desc")
        self.add_filter("LANG(?desc) = \"en\"")
        self.add_label_servise()
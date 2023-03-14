from enum import Enum


class FilterType(Enum):
    WIKIBASEITEM = "item"
    QUANTITY = "quantity"
    TIME= "time"


def Get_FilterType(value : str):
    return FilterType(value)
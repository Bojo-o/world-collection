from enum import Enum


class FilterType(Enum):
    WIKIBASEITEM = "Item"
    QUANTITY = "Quantity"
    TIME= "Time"


def Get_FilterType(value : str):
    return FilterType(value)
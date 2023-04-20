from enum import Enum


class FilterType(Enum):
    '''
    Enum of filter (on wikidata as property) data types, meaning what type the filter value is.
    '''
    WIKIBASEITEM = "Item"
    QUANTITY = "Quantity"
    TIME= "Time"

def get_FilterType(value : str):
    return FilterType(value)
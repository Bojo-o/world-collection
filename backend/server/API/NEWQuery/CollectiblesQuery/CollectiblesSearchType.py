from enum import Enum


class CollectiblesSearchType(Enum):
    AROUND = "around"
    ADMINISTRATIVE = "administrative"

def Get_CollectiblesSearchType(value : str):
    return CollectiblesSearchType(value)
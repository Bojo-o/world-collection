from enum import Enum


class CollectiblesSearchType(Enum):
    AROUND = "Radius"
    ADMINISTRATIVE = "Area"

def Get_CollectiblesSearchType(value : str):
    return CollectiblesSearchType(value)
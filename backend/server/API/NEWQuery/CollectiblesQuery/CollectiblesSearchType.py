from enum import Enum


class CollectiblesSearchType(Enum):
    AROUND = "Radius"
    ADMINISTRATIVE = "Area"
    REGION = "Region"

def Get_CollectiblesSearchType(value : str):
    return CollectiblesSearchType(value)
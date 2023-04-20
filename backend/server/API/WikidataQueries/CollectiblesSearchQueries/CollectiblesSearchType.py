from enum import Enum


class CollectiblesSearchType(Enum):
    AROUND = "Radius"
    ADMINISTRATIVE = "Area"
    REGION = "Region"
    WORLD = "World"

def Get_CollectiblesSearchType(value : str):
    return CollectiblesSearchType(value)
from enum import Enum


class CollectiblesSearchType(Enum):
    '''
    Enum, which contains collection of all supported types of "location" part of collectible searching.
    '''
    AROUND = "Radius"
    ADMINISTRATIVE = "Area"
    REGION = "Region"
    WORLD = "World"

def Get_CollectiblesSearchType(value : str):
    return CollectiblesSearchType(value)
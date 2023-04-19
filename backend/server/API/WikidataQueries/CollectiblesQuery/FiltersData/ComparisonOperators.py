from enum import Enum

class ComparisonOperators(Enum):
    EQUAL_TO = "="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    LESS_THAN = "<"
    GREATER_THAN_OR_EQUAL_TO = ">="
    LESS_THAN_OR_EQUAL_TO = "<="

def Get_ComparisonOperators(value : str):
    return ComparisonOperators(value)
from enum import Enum

class ComparisonOperator(Enum):
    EQUAL_TO = "="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    LESS_THAN = "<"
    GREATER_THAN_OR_EQUAL_TO = ">="
    LESS_THAN_OR_EQUAL_TO = "<="

def get_ComparisonOperator(value : str):
    return ComparisonOperator(value)
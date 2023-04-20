from dataclasses import dataclass
from .ComparisonOperators import ComparisonOperator

@dataclass
class QuantityFilterData:
    '''
    DataClass for storing data about filter of Quantity type.
    '''
    property : str
    comparison_operator : ComparisonOperator
    quantity_value : int
    value_in_unit : str = None
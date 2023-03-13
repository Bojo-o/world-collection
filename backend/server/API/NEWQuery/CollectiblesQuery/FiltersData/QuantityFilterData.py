from dataclasses import dataclass
from .ComparisonOperators import ComparisonOperators

@dataclass
class QuantityFilterData:
    property : str
    comparison_operator : ComparisonOperators
    quantity_value : int
    value_in_unit : str = None
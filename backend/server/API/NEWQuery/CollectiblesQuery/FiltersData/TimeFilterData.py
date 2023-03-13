from dataclasses import dataclass
from .ComparisonOperators import ComparisonOperators

@dataclass
class TimeFilterData:
    property : str
    comparison_operator : ComparisonOperators
    date_value : str
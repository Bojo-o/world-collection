from dataclasses import dataclass
from .ComparisonOperators import ComparisonOperator


@dataclass
class TimeFilterData:
    '''
    DataClass for storing data about filter of Time type.
    '''
    property: str
    comparison_operator: ComparisonOperator
    date_value: str

from dataclasses import dataclass

@dataclass
class WikibaseItemFilterData:
    property : str
    value : str
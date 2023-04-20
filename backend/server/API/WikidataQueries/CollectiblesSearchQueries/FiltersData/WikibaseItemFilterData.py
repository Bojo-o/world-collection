from dataclasses import dataclass

@dataclass
class WikibaseItemFilterData:
    '''
    DataClass for storing data about filter of WikibaseItem type.
    '''
    property : str
    value : str
from abc import ABC,abstractmethod

class QueryBaseBuilder(ABC):
    def __init__(self,super_class_Qnumber : str) -> None:
        self._super_class = super_class_Qnumber

    @abstractmethod
    def build(self) -> str:
        pass
    



# Create abstract class for the document loader
from abc import ABC, abstractmethod
from typing import List, Any
from typing import TypeVar

T = TypeVar("T")

class IBaseDocLoader(ABC):
    @abstractmethod
    def load(self, file_path: str) -> List[T]:
        pass
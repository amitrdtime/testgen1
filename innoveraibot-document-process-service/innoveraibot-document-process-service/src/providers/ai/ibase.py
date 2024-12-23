from typing import List, Any, Dict
from abc import ABC, abstractmethod
from src.config import LangChainConfig


class IBaseAIProvider(ABC):
    def __init__(self, db_connection_string: str, db_name: str, index_name: str):
        self.db_connection_string = db_connection_string
        self.db_name = db_name
        self.index_name = index_name
        
    @abstractmethod
    def save_vector(self, collection_name: str, chunks: List[Any]) -> str:
        pass

    @abstractmethod
    def load_vector(self) -> list:
        pass

    @abstractmethod
    def query(self, question: str) -> str:
        pass
    
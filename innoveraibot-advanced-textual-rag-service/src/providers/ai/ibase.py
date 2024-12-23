from typing import List, Any, Dict
from abc import ABC, abstractmethod


class IBaseAIProvider(ABC):
    def __init__(self, vectordb_connection_string: str, db_name: str, index_name: str):
        self.vectordb_connection_string = vectordb_connection_string
        self.db_name = db_name
        self.index_name = index_name
        
    @abstractmethod
    def save_vector(self, collection_name: str, chunks: List[Any]) -> str:
        pass


    
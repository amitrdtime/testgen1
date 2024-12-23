from dataclasses import dataclass
from typing import List

@dataclass
class TrainLangchainDocumentRequest:
    training_method: str
    dataset_id: str
    document_id: str
    blob_path: str
    document_type: str
    embedding_model_name: str
    max_tokens: int
    embedding_deployment: str
    openai_model: str
    chunk_size: int
    openai_key: str
    num_list: int
    dimensions: int
    user_token: str
    vectordb_connection_string: str
    db_type: str
    db_name: str
    index_name: str
    metadb_connection_string: str
@dataclass
class TrainLangchainDocumentResponse:
    status: bool
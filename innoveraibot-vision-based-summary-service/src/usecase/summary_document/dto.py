from dataclasses import dataclass
from typing import List

@dataclass
class OpenAISummaryDocumentRequest:
    dataset_id: str
    document_id: str
    blob_path: str
    max_tokens: int
    openai_model: str
    openai_key: str
    user_token: str
    vectordb_connection_string: str
    db_name: str
    metadb_connection_string: str
@dataclass
class SummaryDocumentResponse:
    status: bool
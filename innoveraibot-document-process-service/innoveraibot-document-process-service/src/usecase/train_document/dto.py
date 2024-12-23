from dataclasses import dataclass
from typing import List

@dataclass
class TrainDocumentRequest:
    dataset_id: str
    document_id: str
    blob_path: str
    document_type: str
    user_token: str = ""

@dataclass
class TrainDocumentResponse:
    status: bool
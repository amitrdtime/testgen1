from dataclasses import dataclass


@dataclass
class DeleteDocumentVectorRequest:
    dataset_id: str
    file_name: str

@dataclass
class DeleteDocumentVectorResponse:
    success: bool = True    
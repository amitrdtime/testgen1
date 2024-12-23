from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
from langchain.docstore.document import Document
from src.config import DatasetServiceSA
from src.providers.ai.langchain import LangChainAIProvider
from src.providers.azure_blob import AzureBlobProvider
from uuid import uuid4
from src.providers.doc_loaders.pypdfium_loader import PyPDFiumLoader
class DocumentRepository:
    def __init__(self):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)

    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
    

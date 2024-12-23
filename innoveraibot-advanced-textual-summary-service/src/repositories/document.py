from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
from langchain.docstore.document import Document
from src.entities.summary import DocumentSummaryDBEntity, DocumentSummaryEntity

from src.config import DatasetServiceSA,LangchainSummaryServiceSA,SummaryServiceSA
from src.providers.azure_blob import AzureBlobProvider
from src.providers.azure_queue import AzureQueueProvider
import json
from uuid import uuid4
from src.usecase.summary_document.dto import LangchainSummaryDocumentRequest
from src.providers.ai.langchain import LangChainAIProvider
from src.providers.doc_loaders.pypdfium_loader import PyPDFiumLoader
from src.providers.mongo_db import MongoDBProvider


class SummaryRepository:
    def __init__(self,req:LangchainSummaryDocumentRequest):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.dataset_id = req.dataset_id
        self.document_id = req.document_id
        self.blob_path = req.blob_path
        self.max_tokens = req.max_tokens
        self.openai_model = req.openai_model
        self.openai_key = req.openai_key
        self.user_token = req.user_token
        self.db_name = req.db_name
        self.metadb_connection_string = req.metadb_connection_string
        self.reader=PyPDFiumLoader()
        self.langchain_summary_queue_provider = AzureQueueProvider(
            LangchainSummaryServiceSA.connection_string, LangchainSummaryServiceSA.job_queue)
        self.summary_queue_provider = AzureQueueProvider(
            SummaryServiceSA.connection_string, SummaryServiceSA.job_queue)
        self.metadata_db_provider = MongoDBProvider(req)
        self.provider = LangChainAIProvider(req)
        
    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
        
        
        
    def read_pdf(self, local_path: str) -> List[Any]:
        """Read the PDF and returns list of vector documents

        Args:
            local_path (str): Local file path 

        Returns:
            List[Any]: returns list od Vector docuemtns
        """        
        return self.reader.load(local_path)
    
    
    def save_summary_to_db(self, summary_entity: DocumentSummaryEntity) -> DocumentSummaryEntity:
        logging.info(f"db connection string {self.metadb_connection_string}")
        saved_id = self.metadata_db_provider.insert_one(data=summary_entity.db_object)
        summary_entity.id = saved_id
        return summary_entity
    
    
    def summarize_document(self, local_path: str, dataset_id: str) -> DocumentSummaryEntity:
        chunks = self.read_pdf(local_path)
        file_name, summary = self.provider.get_summary(chunks)
        entity = DocumentSummaryEntity(
            id=str(uuid4()),
            dataset_id=dataset_id,
            file_name=file_name,
            content=summary,
            created_at=str(datetime.utcnow())
        )
        logging.info(f"Summaryss: {entity.db_object}")
        saved_entity = self.save_summary_to_db(entity)
        return saved_entity
    
    

        
    def update_dataset_service(self, document_id: str, train_status: str):
        self.dataset_queue_provider.send_message(
            json.dumps({
                "documentId": document_id,
                "SummaryStatus": train_status
            })
        )
        return True
        
    

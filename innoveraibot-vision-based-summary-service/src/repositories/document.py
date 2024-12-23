from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
from src.providers.vector_db import VectorDBProvider

from langchain.docstore.document import Document
from src.entities.summary import DocumentSummaryDBEntity, DocumentSummaryEntity

from src.config import DatasetServiceSA,OpenAISummaryServiceSA,SummaryServiceSA
from src.providers.azure_blob import AzureBlobProvider
from src.providers.azure_queue import AzureQueueProvider
import json
from uuid import uuid4
from src.usecase.summary_document.dto import OpenAISummaryDocumentRequest
from src.providers.ai.langchain import LangChainAIProvider
from src.providers.mongo_db import MongoDBProvider
#from src.config import VectorDB

class SummaryRepository:
    def __init__(self,req:OpenAISummaryDocumentRequest):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.dataset_id = req.dataset_id
        self.document_id = req.document_id
        self.metadb_connection_string = req.metadb_connection_string
        self.langchain_summary_queue_provider = AzureQueueProvider(
            OpenAISummaryServiceSA.connection_string, OpenAISummaryServiceSA.job_queue)
        self.summary_queue_provider = AzureQueueProvider(
            SummaryServiceSA.connection_string, SummaryServiceSA.job_queue)
        self.metadata_db_provider = MongoDBProvider(req)
        self.provider = LangChainAIProvider(req)

        self.vector_db_provider = VectorDBProvider(req)
        
        
    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        local_path = local_path.replace("\\", "/")
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
        

    
    def get_langchain_docs(self, documents:List[Any]):
        text_content_list = []
        page_list = []
        source_list = []

        for doc in documents:
            text_content_list.append(doc.get('textContent', ''))
            page_list.append(doc.get('page', ''))
            source_list.append(doc.get('source', ''))
        for text_content, page_number, source in zip(text_content_list, page_list, source_list):
            langchain_documents = self.raw_doc_to_chunks(text_content, page_number,source)
        return langchain_documents
    
    def raw_doc_to_chunks(self, text_content, page_number, source):
        doc_chunks=[]
        doc = Document(
                    page_content=text_content, metadata={}
                )
        doc.metadata["page"] = page_number
        doc.metadata["source"] = source
        doc_chunks.append(doc)
        return doc_chunks
    
    def get_chunks_from_db(self,  file_name: str) -> List[Any]:
        logging.info(f"Getting chunks from DB: {self.dataset_id}, {file_name}")
        
        documents = self.vector_db_provider.get_db_data( file_name)
        logging.info(f"Found {len(documents)} documents")
        chunks= self.get_langchain_docs(documents)
        return chunks
    
    
    
    
    def save_summary_to_db(self, summary_entity: DocumentSummaryEntity) -> DocumentSummaryEntity:
        logging.info(f"db connection string {self.metadb_connection_string}")
        saved_id = self.metadata_db_provider.insert_one(data=summary_entity.db_object)
        summary_entity.id = saved_id
        return summary_entity
    
    
    def summarize_document(self, file_name: str) -> DocumentSummaryEntity:
        chunks= self.get_chunks_from_db( file_name)
        logging.info(f"Chunkssd: {len(chunks)}")
        file_name, summary = self.provider.get_summary(chunks)
        entity = DocumentSummaryEntity(
            id=str(uuid4()),
            dataset_id=self.dataset_id,
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
                "SummaryStatus": "Trained"
            })
        )
        return True
        
    

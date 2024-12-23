from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
from src.config import DatasetServiceSA
from src.providers.azure_blob import AzureBlobProvider
from uuid import uuid4
from src.entities.summary import DocumentSummaryDBEntity, DocumentSummaryEntity
from src.entities.doc_metadata import DocumentMetadataDBEntity,DocumentMetadataEntity
from src.entities.page_metadata import PageMetadataDBEntity,PageMetadataEntity

from src.providers.mongo_db import MongoDBProvider

from typing import List
import json
import logging
from uuid import uuid4
from datetime import datetime
from dataclasses import asdict
from src.usecase.train_document.dto import TrainOpenAIDocumentRequest


from src.config import DatasetServiceSA, OpenAITrainingServiceSA,SummaryServiceSA
#from src.entities.dataset import DatasetDBEntity
#from src.entities.document import DocumentEntity, DocumentDBEntity, UserEntity
from src.exceptions import FunctionException
from src.providers.mongo_db import MongoDBProvider
from src.providers.azure_blob import AzureBlobProvider
#from src.entities.document import DocumentEntity
from src.providers.azure_queue import AzureQueueProvider
from src.repositories.document import DocumentRepository
from src.usecase.train_image.dto import TrainImageRequest


class DocumentImageRepository(DocumentRepository):
    def __init__(self,req:TrainImageRequest):
        super().__init__(req.metadb_connection_string, req.openai_key)
        self.image_queue_provider = AzureQueueProvider( 
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        self.summary_queue_provider = AzureQueueProvider(
            SummaryServiceSA.connection_string, SummaryServiceSA.job_queue)
            
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        self.training_method=req.training_method
        self.dataset_id = req.dataset_id
        self.document_id = req.document_id
        self.blob_path = req.blob_path
        self.document_type = req.document_type
        self.embedding_model_name = req.embedding_model_name
        self.max_tokens = req.max_tokens
        self.embedding_deployment = req.embedding_deployment
        self.openai_model = req.openai_model
        self.chunk_size = req.chunk_size
        self.openai_key = req.openai_key
        self.num_list = req.num_list
        self.dimensions = req.dimensions
        self.user_token = req.user_token
        self.vectordb_connection_string = req.vectordb_connection_string
        self.db_type = req.db_type
        self.db_name = req.db_name
        self.index_name = req.index_name
        self.metadb_connection_string = req.metadb_connection_string
        self.metadata_db_provider = MongoDBProvider(req.metadb_connection_string)
        
    
    def download_img_blob(self, blob_path: str) -> str:
        local_path = os.path.join("tmp", blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
        
    def update_summary_service(self,file_blob_path:str):
        data = {
            "job": "OpenAIDocumentSummarization",
            "datasetId": self.dataset_id,
            "documentId": self.document_id,
            "blobPath": file_blob_path,
            "maxTokens": self.max_tokens,
            "openAIModel": self.openai_model,
            "openAIKey": self.openai_key,
            "userToken": self.user_token,
            "vectorDBConnectionString": self.vectordb_connection_string,
            "dbName": self.db_name,
            "metadbConnectionString": self.metadb_connection_string
        }
        self.summary_queue_provider.send_message(data)
    
    
    def save_page_meta_to_db(self, blob_path, page_blob_path,page_number,status):
        entity = PageMetadataEntity(
            id=str(uuid4()),
            blobPath=blob_path,
            pageBlobPath=page_blob_path,
            pageNumber=page_number,
            status=status,
            created_at=str(datetime.utcnow())
        )
        
        doc: PageMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=PageMetadataDBEntity, search={"pageBlobPath": page_blob_path})
        if doc:
            logging.info("Retraining the document pages")
        else:
            saved_meta_entity = self.save_metadata_to_db(entity)
            logging.info(f"Saved Meta Data: {saved_meta_entity}")
        return True
    
    def trained_images_count(self, file_blob_path: str) -> int:
        return self.metadata_db_provider.get_count(model=PageMetadataDBEntity, filter={"blobPath": file_blob_path})

    def total_pages_of_pdf(self, file_blob_path: str) -> int:
        doc: DocumentMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=DocumentMetadataDBEntity, search={"blobPath": file_blob_path})
        doc = doc[0]
        return doc.numOfImages
    
    
    
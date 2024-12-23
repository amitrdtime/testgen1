from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
import json
from langchain.docstore.document import Document
from src.config import DatasetServiceSA
from src.providers.azure_blob import AzureBlobProvider
from uuid import uuid4
from src.entities.summary import DocumentSummaryDBEntity, DocumentSummaryEntity
from src.providers.mongo_db import MongoDBProvider
from src.entities.page_metadata import PageMetadataDBEntity
from src.entities.doc_metadata import DocumentMetadataDBEntity
from src.usecase.train_document.dto import TrainOpenAIDocumentRequest, TrainOpenAIDocumentResponse
from src.entities.doc_metadata import DocumentMetadataDBEntity,DocumentMetadataEntity
from src.entities.page_metadata import PageMetadataDBEntity,PageMetadataEntity
from src.config import DatasetServiceSA, OpenAITrainingServiceSA
from src.providers.azure_queue import AzureQueueProvider
from src.providers.doc_loaders.openai_loader import OpenAILoader

class DocumentRepository:
    def __init__(self,metadb_connection_string:str, openai_key: str):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.image_queue_provider = AzureQueueProvider( 
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        
        self.metadata_db_provider = MongoDBProvider(metadb_connection_string)
        self.openai_loader = OpenAILoader(openai_key)
    def get_image_from_pdf(self, file_path: str) -> List[str]:
        """Getting image from the given file path 

        Args:
            file_path (str): PDF file path

        Returns:
            List[str]: List of local image file path
        """        
        return self.openai_loader.pdf_to_image(file_path)

    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path


    def upload_image_to_blob(self, local_file_path: str, blob_path: str) -> str:
        container_name = DatasetServiceSA.container
        self.blob_provider.upload_blob(container_name, blob_path, local_file_path)
        return True

    def delete_document_page_meta(self, dataset_id: str, file_name: str) -> bool:
        blob_path = f"{dataset_id}/{file_name}"
        try:
            #page_doc: PageMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=PageMetadataDBEntity, search={"blobPath": blob_path})
            page_docs: List[PageMetadataDBEntity] = self.metadata_db_provider.get_all(model=PageMetadataDBEntity, filter={"blobPath": blob_path})
            if not page_docs:
                logging.warn(f"Document not found in DB: {dataset_id}, {file_name}")
                return False
            else:
                for page_doc in page_docs:
                    logging.info(f"Found {page_doc} in page_doc..")
                    self.metadata_db_provider.delete(model=PageMetadataDBEntity, id=page_doc._id)
                    logging.info(f"Deleted document pagess entry: {dataset_id}, {file_name}")

            return True
        except Exception as e:
            logging.warning(f"No metadata found")
            return True
        
    def delete_document_meta(self, dataset_id: str, file_name: str) -> bool:
        logging.info(f"Deleting document pagess entry: {dataset_id}, {file_name}")
        blob_path = f"{dataset_id}/{file_name}"
        try:
            doc: DocumentMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=DocumentMetadataDBEntity, search={"blobPath": blob_path})
            logging.info(f"Found {doc[0]} in doc..")
            if not doc:
                logging.warn(f"Document not found in DB: {dataset_id}, {file_name}")
                return False
            else:
                doc = doc[0]
            self.metadata_db_provider.delete(model=DocumentMetadataDBEntity, id=doc._id)
            logging.info(f"Deleted document total entry: {dataset_id}, {file_name}")
            return True
        except Exception as e:
            logging.warning(f"No metadata found")
            return True
        
        
    def save_file_meta_to_db(self, dataset_id: str, blob_path: str, num_of_pages: int):
        entity = DocumentMetadataEntity(
            id=str(uuid4()),
            dataset_id=dataset_id,
            blobPath=blob_path,
            numOfImages=num_of_pages,
            created_at=str(datetime.utcnow())
        )
        doc: DocumentMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=DocumentMetadataDBEntity, search={"blobPath": blob_path})
        if doc:
            logging.info("Retraining the d ocument")
        else:
            saved_meta_entity = self.save_metadata_to_db(entity)
            logging.info(f"Saved Meta Data: {saved_meta_entity}")
        return True
    
    def save_metadata_to_db(self, summary_entity: DocumentMetadataEntity) -> DocumentMetadataEntity:
        saved_id = self.metadata_db_provider.insert_one(data=summary_entity.db_object)
        summary_entity.id = saved_id
        return summary_entity
    
    def update_image_service(self,req:TrainOpenAIDocumentRequest, page_number: str,blob_path: str, document_type: str,document_id: str):
        data = {
            "job": "DocumentImageTraining",
            "trainingMethod": req.training_method,
            "datasetId": req.dataset_id,
            "documentType": document_type,
            "blobPath": blob_path,
            "documentId": document_id,
            "pageNumber": page_number,
            "embeddingModelName": req.embedding_model_name,
            "maxTokens": req.max_tokens,
            "embeddingDeployment": req.embedding_deployment,
            "openAIModel": req.openai_model,
            "chunkSize": req.chunk_size,
            "openAIKey": req.openai_key,
            "numList": req.num_list,
            "dimensions": req.dimensions,
            "userToken": "token",
            "vectorDBConnectionString": req.vectordb_connection_string,
            "dbType": req.db_type,
            "dbName": req.db_name,
            "indexName": req.index_name,
            "metadbConnectionString": req.metadb_connection_string
        }
        self.image_queue_provider.send_message(data)
        
    def update_dataset_service(self, document_id: str, train_status: str):
        self.dataset_queue_provider.send_message(
            json.dumps({
                "documentId": document_id,
                "trainingStatus": train_status
            })
        )
        return True
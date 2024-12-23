from datetime import datetime
import json
from typing import Any, Dict, List
from src.config import DatasetServiceSA, MultimodalTrainingServiceSA,LangchainTrainingServiceSA
from src.providers.azure_queue import AzureQueueProvider
from src.providers.azure_blob import AzureBlobProvider
from src.entities.user import UserEntity
from src.config import DocumentTrainingStatus
from src.repositories.document import DocumentRepository
import logging
import os
import time
from src.usecase.train_document.dto import TrainMultimodalDocumentRequest
from src.config import DatasetServiceSA, OpenAITrainingServiceSA



class AIRepository:
    def __init__(self, req: TrainMultimodalDocumentRequest):
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.dataset_id = req.dataset_id
        self.image_queue_provider = AzureQueueProvider( 
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        self.genai_queue_provider = AzureQueueProvider(
            MultimodalTrainingServiceSA.connection_string, MultimodalTrainingServiceSA.job_queue)
        self.langchain_training_queue_provider = AzureQueueProvider(
            LangchainTrainingServiceSA.connection_string, LangchainTrainingServiceSA.job_queue)



    def update_dataset_service(self, document_id: str, train_status: str):
        self.dataset_queue_provider.send_message(
            json.dumps({
                "documentId": document_id,
                "trainingStatus": train_status
            })
        )
        return True
    
    def update_langchain_training_service(self, req: TrainMultimodalDocumentRequest):
        data = {
            "datasetId": self.dataset_id,
            "trainingMethod": req.training_method,
            "documentType": req.document_type,
            "blobPath": req.blob_path,
            "documentId": req.document_id,
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
            "metadbConnectionString": req.metadb_connection_string,
        }

        self.langchain_training_queue_provider.send_message(data)
        


    def update_image_service(self,req:TrainMultimodalDocumentRequest, page_number: str,blob_path: str):
        data = {
            "job":"DocumentImageTraining",
            "trainingMethod": "multimodal",
            "datasetId": req.dataset_id,
            "documentType": req.document_type,
            "blobPath": blob_path,
            "documentId": req.document_id,
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
        
        
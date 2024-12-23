from datetime import datetime
import json
from typing import Any, Dict, List
from src.providers.ai.langchain import LangChainAIProvider
from src.config import DatasetServiceSA, LangchainTrainingServiceSA, SummaryServiceSA
from src.providers.azure_queue import AzureQueueProvider
from src.providers.azure_blob import AzureBlobProvider
from src.providers.doc_loaders.pypdfium_loader import PyPDFiumLoader
from src.entities.user import UserEntity
from src.config import DocumentTrainingStatus
from src.repositories.document import DocumentRepository
import logging
import os
import time
from src.usecase.train_document.dto import TrainLangchainDocumentRequest

cache: Dict[str, LangChainAIProvider] = {}

class AIRepository:
    def __init__(self, req: TrainLangchainDocumentRequest):
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.training_method = req.training_method
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
        self.summary_queue_provider = AzureQueueProvider(
            SummaryServiceSA.connection_string, SummaryServiceSA.job_queue)
        self.repo = DocumentRepository()
        global cache

        self.reader = PyPDFiumLoader()
        if req.dataset_id in cache:
            self.provider = cache[req.dataset_id]
        else:
            self.provider = LangChainAIProvider(
                req.vectordb_connection_string,
                req.db_name,
                req.dataset_id,
                req.index_name,
                req
            )
            cache[req.dataset_id] = self.provider

    def train(self, local_path: str) -> bool:
        # The metadata contains the original file name and the page numner in calse of image file processing
            chunks = []
            # make sure we delete existing things.............
            if local_path.lower().endswith('.pdf'):
                chunks = self.reader.load(local_path)
                logging.info(f"Training completed for path {chunks}")
                chunks = [chunk for chunk in chunks if chunk.page_content.strip() != '']
                if not chunks:
                    # Do not save the vectors if the document is empty with only images
                    return True
            else:
                raise NotImplementedError("Only PDFs are supported")
            try:
                self.provider.save_vector(chunks,local_path)
                #self.provider.save_vector(chunks, local_path)
                logging.info(f"Training completed for {local_path}")
                return True
            except Exception as e:
                # Index error comes due to duplication of index before dropping it as we are running concurrent jobs at a time
                logging.warning(f"Index duplication is avoided")
                time.sleep(2)
                return True


    def update_dataset_service(self, document_id: str, train_status: str):
        self.dataset_queue_provider.send_message(
            json.dumps({
                "documentId": document_id,
                "trainingStatus": train_status
            })
        )
        return True


    def update_summary_service(self):
        data = {
            "job": "LangchainDocumentSummarization",
            "datasetId": self.dataset_id,
            "documentId": self.document_id,
            "blobPath": self.blob_path,
            "maxTokens": self.max_tokens,
            "openAIModel": self.openai_model,
            "openAIKey": self.openai_key,
            "userToken": self.user_token,
            "vectorDBConnectionString": self.vectordb_connection_string,
            "dbName": self.db_name,
            "metadbConnectionString": self.metadb_connection_string
        }
        self.summary_queue_provider.send_message(data)
        
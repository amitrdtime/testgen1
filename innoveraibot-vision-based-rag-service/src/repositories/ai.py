import json
from typing import Any, Dict
from src.providers.ai.langchain import LangChainAIProvider
from src.config import DatasetServiceSA
from src.providers.azure_queue import AzureQueueProvider
from src.providers.doc_loaders.openai_loader import OpenAILoader
from src.usecase.train_image.dto import TrainImageRequest

import logging
import time
cache: Dict[str, LangChainAIProvider] = {}
cache: Dict[str, OpenAILoader] = {}

class AIDocumentRepository():
    def __init__(self, req: TrainImageRequest):
        
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.dataset_id = req.dataset_id
        
        global cache

        self.image_reader = OpenAILoader(req.openai_key)
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

    def train(self, req:TrainImageRequest,local_path: str, metadata: Dict[str, Any] = {}) -> bool:
        # The metadata contains the original file name and the page numner in calse of image file processing
            chunks = []
            if local_path.lower().endswith('.png') or local_path.lower().endswith('.jpg'):
                if not metadata:
                    raise ValueError("Metadata is required for image files")
                else:
                    chunks = self.image_reader.load(local_path, metadata)
                    
            else:
                raise NotImplementedError("Only PDF and Image files are supported")
            try:
                self.provider.save_vector(chunks, local_path,req)
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

    
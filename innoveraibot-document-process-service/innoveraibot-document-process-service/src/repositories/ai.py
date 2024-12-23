import json
from src.config import VectorDB, DatasetServiceSA, MultimodalTrainingServiceSA,LangchainTrainingServiceSA,OpenAITrainingServiceSA,MetaDataDBConfig
from src.providers.azure_queue import AzureQueueProvider
from src.config import LangChainConfig,SummaryServiceSA, AppConfig
import logging

class AIRepository:
    def __init__(self, dataset_id: str):
        self.langchain_training_queue_provider = AzureQueueProvider(
            LangchainTrainingServiceSA.connection_string, LangchainTrainingServiceSA.job_queue)
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.openai_training_queue_provider = AzureQueueProvider(
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        self.multimodal_training_queue_provider = AzureQueueProvider(
            MultimodalTrainingServiceSA.connection_string, MultimodalTrainingServiceSA.job_queue)
        self.summary_queue_provider = AzureQueueProvider(
            SummaryServiceSA.connection_string, SummaryServiceSA.job_queue)
        self.dataset_id = dataset_id


                
    def update_dataset_service(self, document_id: str, train_status: str):
        self.dataset_queue_provider.send_message(
            json.dumps({
                "documentId": document_id,
                "trainingStatus": train_status
            })
        )
        return True
    
    def update_summary_service(self, dataset_id: str, file_name: str):
        data= {
            "job":"DeleteDocumentSummary",
            "datasetId": dataset_id,
            "fileName": file_name
        }
        logging.info(f"Sending message to summary service to delete summary: {data}")
        self.summary_queue_provider.send_message(data)
        
        
    def _create_data(self):
        return {
            "trainingMethod": AppConfig.training_method,
            "datasetId": self.dataset_id,
            "embeddingModelName": LangChainConfig.embedding_model_name,
            "maxTokens": LangChainConfig.max_tokens,
            "embeddingDeployment": LangChainConfig.embedding_deployment,
            "openAIModel": LangChainConfig.openai_model,
            "chunkSize": LangChainConfig.chunk_size,
            "openAIKey": LangChainConfig.openai_key,
            "numList": LangChainConfig.num_list,
            "dimensions": LangChainConfig.dimensions,
            "userToken": "token",
            "vectorDBConnectionString": VectorDB.connection_string,
            "dbType": VectorDB.db_type,
            "dbName": VectorDB.db_name,
            "indexName": VectorDB.index_name,
            "metadbConnectionString":MetaDataDBConfig.connection_string
        }
        
        

    def update_langchain_training_service(self, document_id: str, blob_path: str, document_type: str):
        data = self._create_data()
        data.update({
            "documentType": document_type,
            "blobPath": blob_path,
            "documentId": document_id
        })

        self.langchain_training_queue_provider.send_message(data)
    
    def update_openai_training_service(self, document_id: str, blob_path: str, document_type: str):
        data = self._create_data()
        data.update({
            "documentType": document_type,
            "blobPath": blob_path,
            "documentId": document_id
        })
        self.openai_training_queue_provider.send_message(data)
    
    def update_multimodal_training_service(self, document_id: str, blob_path: str, document_type: str):
        data = self._create_data()
        data.update({
            "documentType": document_type,
            "blobPath": blob_path,
            "documentId": document_id
        })
        self.multimodal_training_queue_provider.send_message(data)



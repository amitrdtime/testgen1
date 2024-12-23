import json
import logging
from typing import List
from datetime import datetime

import pymongo
from .ibase import IBaseAIProvider
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores.azure_cosmos_db import (
    AzureCosmosDBVectorSearch,
    CosmosDBSimilarityType,
)
from langchain.docstore.document import Document
from src.config import LoggerKeys
# from langchain.text_splitter import CharacterTextSplitter
# from langchain.document_loaders import DirectoryLoader
from src.usecase.train_image.dto import TrainImageRequest



class LangChainAIProvider(IBaseAIProvider):
    def __init__(self, vectordb_connection_string: str, db_name: str, collection_name: str, index_name: str,req:TrainImageRequest):
        super().__init__(vectordb_connection_string, db_name, index_name)
        self.embedding_model_name = req.embedding_model_name
        self.max_tokens = req.max_tokens
        self.model_deployment = req.embedding_deployment
        self.embeddings: OpenAIEmbeddings = OpenAIEmbeddings(
            deployment=self.model_deployment,
            model=self.embedding_model_name,
            chunk_size=req.chunk_size,
            openai_api_key=req.openai_key,
        )
        self.openai_model = req.openai_model
        self.collection_name = collection_name
        self.db_client = pymongo.MongoClient(vectordb_connection_string)
        self.db_collection = self.db_client[db_name][collection_name]
        # self.db_client.close()

    def __start_client(self):
        self.db_client = pymongo.MongoClient(self.vectordb_connection_string)
        self.db_collection = self.db_client[self.db_name][self.collection_name]


    def save_vector(self, chunks: List[Document], document_path: str, req:TrainImageRequest) -> bool:
        
        self.__start_client()
        vectorstore = AzureCosmosDBVectorSearch.from_documents(
            chunks,
            self.embeddings,
            collection=self.db_collection,
            index_name=self.index_name,
            )
        self.db_collection.drop_indexes()
        vectorstore.create_index(
            req.num_list, req.dimensions, CosmosDBSimilarityType.COS
        )
        # Logging to Azure APP Insights
        logging.info(json.dumps({
            LoggerKeys.TRAIN: "LangChainAIProvider.save_vector",
            "timeStamp": str(datetime.utcnow().isoformat()),
            "chunks": len(chunks),
            "collection": self.collection_name,
            "index": self.index_name,
            "documentPath": document_path,
            "config": {
                "embeddingModel": self.embedding_model_name,
                "maxTokens": self.max_tokens,
                "modelDeployment": self.model_deployment,
                "openaiModel": self.openai_model,
                "dimensions": req.dimensions,
                "numList": req.num_list,
                "chunkSize": req.chunk_size,
                "similarityAlgorithm": "COS"
            }
        }))
        # self.db_client.close()
        return True

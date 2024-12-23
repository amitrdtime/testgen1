import os
import logging
from pymongo import MongoClient
from src.usecase.summary_document.dto import OpenAISummaryDocumentRequest
class VectorDBProvider:
    def __init__(self,req:OpenAISummaryDocumentRequest):
        self.client = MongoClient(req.vectordb_connection_string)
        self.dataset_id = req.dataset_id
        self.db = self.client[req.db_name]

    def delete_vector(self, collection_name: str, source: str):
        collection = self.db[collection_name]
        if collection_name not in self.db.list_collection_names():
            raise Exception(f"Collection {collection_name} not found")
        
        source = os.path.join("/tmp", source)
        source = source.replace("\\", "/")
        logging.info(f"Deleting vector: `{collection_name}`, Source: `{source}`")
        query = {"source": source}
        logging.info(f"Query => {query}")
        vectors = collection.find(query)    
        count = collection.count_documents(query)

        logging.info(f"====> Document count: {count}")

        
        if not vectors:
            logging.info("No vector found")
            raise Exception("No vector found")

        for v in vectors:
            # raise Exception("Deleting vector....")
            logging.info(f"Deleing vector: {v['_id']}")
            collection.delete_one({"_id": v['_id']})
            
    def delete_duplicate_vector(self,dataset_id, file_name):
        
        #dataset_id="8c8206f2-7c5b-4c96-9189-0f06517a6e6a"
        collection = self.db[dataset_id]
        documents = list(collection.find({}).sort("_id", 1))
        grouped_documents = {}
        for doc in documents:
            page = doc.get('page')
            if page not in grouped_documents:
                grouped_documents[page] = []
            grouped_documents[page].append(doc)
        # For each group, delete all documents except the first one
        for page, docs in grouped_documents.items():
            for doc in docs[1:]:  # Skip the first document
                collection.delete_one({"_id": doc['_id']})
        return True
    def get_db_data(self,file_name:str): 
        collection = self.db[self.dataset_id]
        source = f"/tmp/{self.dataset_id}/{file_name}"
        query = {"source": source, "textContent": {"$exists": True}}
        documents = list(collection.find(query))
        return documents
    

        
        
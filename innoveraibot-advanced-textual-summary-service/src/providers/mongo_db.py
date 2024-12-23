import logging
import mongoengine
from mongoengine import disconnect, register_connection
from mongoengine import Document
from typing import Dict, Any, List
from datetime import datetime
from src.usecase.summary_document.dto import LangchainSummaryDocumentRequest
# register_connection(alias="metadata_db", name="metadata_db")


class MongoDBProvider:
    def __init__(self,req:LangchainSummaryDocumentRequest):
        self.client = mongoengine.connect(
            host=req.metadb_connection_string,
            alias="default"
        )
        logging.info(f"Connected to MongoDB: {req.metadb_connection_string}")
        self.host = req.metadb_connection_string

    def insert_one(self, data: Document) -> str:
        saved_record = data.save()
        logging.info(f"Saved Record: {saved_record._id}")
        return saved_record._id
    
    def get_all(self, model: Document, filter: Dict[str, Any], sort: str="", sort_by: str = "") -> List[Document]:
        sort_order = '+' if sort == 'asc' else '-'
        if filter:
            logging.info(f"Query ===> {model.objects(**filter)._query}")
            if sort_by:
                return model.objects(**filter).order_by(f"{sort_order}{sort_by}")
            return model.objects(**filter)
        if sort_by:
            return model.objects().order_by(f"{sort_order}{sort_by}")
        return model.objects()
    
    def get_by_ref(self, model: Document, search: Dict[str, Any]) -> List[Document]:
        logging.info(f"Query ===> {model.objects(**search)._query}")
        objects = model.objects(**search)
        return objects
    
    def update(self, model: Document, id: str, data: Document) -> Document:
        data.save()
    
    def get_by_id(self, model: Document, id: str) -> Document:
        obj = model.objects(_id=id).first()
        return obj
    
    def delete(self, model: Document, id: str) -> bool:
        model.objects(_id=id).delete()
        return True

    def get_count(self, model: Document, filter: Dict[str, Any]) -> int:
        return model.objects(**filter).count()
    

from dataclasses import dataclass, asdict
import json
import logging
from mongoengine import Document, StringField, DictField, ListField, BooleanField, register_connection

# register_connection(alias="metadata_db", name="metadata_db")

class DocumentSummaryDBEntity(Document):
    meta = {
        'collection': 'DocumentSummary',
        'indexs': [
            'datasetId',
            'createdUTC'
        ],
        # 'db_alias': 'metadata_db'
    }
    _id: str = StringField(primary_key=True)
    datasetId = StringField(required=True)
    fileName = StringField(required=True)
    content = StringField(required=True)
    createdUTC = StringField(required=True)
    
@dataclass
class DocumentSummaryEntity:
    id: str
    dataset_id: str
    file_name: str
    content: str
    created_at: str
    db_object: Document = None

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "datasetId": self.dataset_id,
            "fileName": self.file_name,
            "createdUTC": self.created_at,
        })
    
    def __post_init__(self):
        try:
            self.db_object = DocumentSummaryDBEntity(
                _id=self.id,
                datasetId=self.dataset_id,
                fileName=self.file_name,
                createdUTC=self.created_at,
                content=self.content,
            )
        except Exception as e:
            logging.error(f"Error while creating DB object: {e}")
            
from dataclasses import dataclass, asdict
import json
import logging
from mongoengine import Document, StringField, DictField, ListField, BooleanField, IntField,register_connection

# register_connection(alias="metadata_db", name="metadata_db")

class DocumentMetadataDBEntity(Document):
    meta = {
        'collection': 'DocumentMetadata',
        'indexs': [
            'datasetId',
            'createdUTC'
        ],
        # 'db_alias': 'metadata_db'
    }
    _id: str = StringField(primary_key=True)
    datasetId = StringField(required=True)
    blobPath = StringField(required=True)
    numOfImages = IntField(required=True)
    createdUTC = StringField(required=True)
    
@dataclass
class DocumentMetadataEntity:
    id: str
    dataset_id: str
    blobPath: str
    numOfImages: int
    created_at: str
    db_object: Document = None

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "datasetId": self.dataset_id,
            "fileName": self.blobPath,
            "numOfImages": self.numOfImages,
            "createdUTC": self.created_at,
        })
    
    def __post_init__(self):
        try:
            self.db_object = DocumentMetadataDBEntity(
                _id=self.id,
                datasetId=self.dataset_id,
                blobPath=self.blobPath,
                createdUTC=self.created_at,
                numOfImages=self.numOfImages,
            )
        except Exception as e:
            logging.error(f"Error while creating DB object: {e}")
            
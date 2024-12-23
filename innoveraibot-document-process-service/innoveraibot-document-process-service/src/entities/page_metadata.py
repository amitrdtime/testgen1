from dataclasses import dataclass
import json
import logging
from mongoengine import Document, StringField, BooleanField, IntField

# register_connection(alias="metadata_db", name="metadata_db")

class PageMetadataDBEntity(Document):
    meta = {
        'collection': 'PageMetadata',
        'indexs': [
            'blobPath',
            'createdUTC'
        ],
        # 'db_alias': 'metadata_db'
    }
    _id: str = StringField(primary_key=True)
    blobPath = StringField(required=True)
    pageBlobPath = StringField(required=True)
    pageNumber = IntField(required=True)
    status=BooleanField(required=True)
    createdUTC = StringField(required=True)
    
@dataclass
class PageMetadataEntity:
    id: str
    blobPath: str
    pageBlobPath: str
    pageNumber: int
    status: bool
    created_at: str
    db_object: Document = None

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "blobPath": self.blobPath,
            "pageBlobPath": self.pageBlobPath,
            "pageNumber": self.pageNumber,
            "status": self.status,
            "createdUTC": self.created_at,
        })
    
    def __post_init__(self):
        try:
            self.db_object = PageMetadataDBEntity(
                _id=self.id,
                blobPath=self.blobPath,
                pageBlobPath=self.pageBlobPath,
                pageNumber=self.pageNumber,
                status=self.status,
                createdUTC=self.created_at,
            )
        except Exception as e:
            logging.error(f"Error while creating DB object: {e}")
            
from dataclasses import dataclass, asdict
import json
import logging
from mongoengine import Document, StringField, DictField, ListField, BooleanField, IntField


class VectorDBEntity(Document):
    meta = {'allow_inheritance': True, 'abstract': True}
    # meta = {"collection": "0628ad7e-dd7c-468e-aa57-e5e24ca793d3"}
    _id: str = StringField(primary_key=True)
    textContent = StringField(required=True)
    source = StringField(required=True)
    page = IntField(required=True)
    vectorContent = ListField(default=[])
    
@dataclass
class VectorEntity:
    id: str
    text_content: str
    source: str
    page: int

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "textContent": self.text_content,
            "fileName": self.source,
            "page": self.page,
        })
    
    def __post_init__(self):
        try:
            self.db_object = VectorDBEntity(
                _id=self.id,
                textContent=self.text_content,
                source=self.source,
                page=self.page,
                vectorContent=[]
            )
        except Exception as e:
            logging.error(f"Error while creating DB object: {e}")
            
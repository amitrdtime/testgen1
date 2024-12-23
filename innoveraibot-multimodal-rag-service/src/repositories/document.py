from datetime import datetime
import logging
from typing import List, Any, Tuple
import os
from langchain.docstore.document import Document
from src.config import DatasetServiceSA,OpenAITrainingServiceSA
from src.providers.azure_blob import AzureBlobProvider
from src.providers.azure_queue import AzureQueueProvider
from src.providers.mongo_db import MongoDBProvider
from src.entities.doc_metadata import DocumentMetadataDBEntity,DocumentMetadataEntity

import fitz
from PIL import Image
import io
from io import BytesIO
from uuid import uuid4


class DocumentRepository:
    def __init__(self,metadb_connection_string:str):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        self.dataset_queue_provider = AzureQueueProvider(
            DatasetServiceSA.connection_string, DatasetServiceSA.job_queue)
        self.image_queue_provider = AzureQueueProvider( 
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        self.metadata_db_provider = MongoDBProvider(metadb_connection_string)


    
    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
    
    def upload_image_to_blob(self, local_file_path: str, blob_path: str) -> str:
        container_name = DatasetServiceSA.container
        self.blob_provider.upload_blob(container_name, blob_path, local_file_path)
        return True
    
    def save_file_meta_to_db(self, dataset_id: str, blob_path: str, num_of_pages: int):
        entity = DocumentMetadataEntity(
            id=str(uuid4()),
            dataset_id=dataset_id,
            blobPath=blob_path,
            numOfImages=num_of_pages,
            created_at=str(datetime.utcnow())
        )
        doc: DocumentMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=DocumentMetadataDBEntity, search={"blobPath": blob_path})
        if doc:
            logging.info("Retraining the d ocument")
        else:
            saved_meta_entity = self.save_metadata_to_db(entity)
            logging.info(f"Saved Meta Data: {saved_meta_entity}")
        return True
    
    def save_metadata_to_db(self, summary_entity: DocumentMetadataEntity) -> DocumentMetadataEntity:
        saved_id = self.metadata_db_provider.insert_one(data=summary_entity.db_object)
        summary_entity.id = saved_id
        return summary_entity
    
    
    
    def extract_images(self,file_path:str)->List[Any]:
        pdf_file = fitz.open(file_path) 
        extracted_images = []
        dir_name, pdf_name = os.path.split(file_path)
        pdf_name = os.path.splitext(pdf_name)[0]
        image_dir = os.path.join(dir_name, pdf_name,'imgs')
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)
        for page_index in range(len(pdf_file)): 
            # get the page itself 
            page = pdf_file[page_index] 
            image_list = page.get_images() 
            for image_index, img in enumerate(image_list, start=1): 
                # get the XREF of the image 
                xref = img[0]
                # extract the image bytes 
                base_image = pdf_file.extract_image(xref) 
                image_bytes = base_image["image"] 
                # create an image PIL object
                image = Image.open(io.BytesIO(image_bytes))
                # save the image to the directory
                single_image_path=os.path.join(image_dir, f'image_{page_index}_{image_index}.png')
                image.save(single_image_path)
                extracted_images.append(single_image_path)
        return extracted_images

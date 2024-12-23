import logging
from typing import List, Any
import os
from src.config import DatasetServiceSA
from src.providers.azure_blob import AzureBlobProvider
from src.providers.mongo_db import MongoDBProvider
from src.providers.vector_db import VectorDBProvider
from src.entities.page_metadata import PageMetadataDBEntity
from src.entities.doc_metadata import DocumentMetadataDBEntity
class DocumentRepository:
    def __init__(self):
        self.blob_provider = AzureBlobProvider(DatasetServiceSA.connection_string)
        
        self.metadata_db_provider = MongoDBProvider()
        self.vector_db_provider = VectorDBProvider()

    def read_pdf(self, local_path: str) -> List[Any]:
        """Read the PDF and returns list of vector documents

        Args:
            local_path (str): Local file path 

        Returns:
            List[Any]: returns list od Vector docuemtns
        """        
        return self.reader.load(local_path)

    def download_blob(self, blob_path: str) -> str:
        tmp_path = os.path.join("/tmp")
        logging.info(f"Downloading blob: {blob_path}")
        local_path = os.path.join(tmp_path, blob_path)
        dir = os.path.dirname(local_path)
        os.makedirs(dir, exist_ok=True)
        self.blob_provider.download_blob(
            DatasetServiceSA.container, blob_path, local_path)
        return local_path
    
    def delete_document_vector(self, dataset_id: str, file_name: str) -> bool:
        logging.info(f"Deleting document vector: {dataset_id}, {file_name}")
        try:
            source_name = f"{dataset_id}/{file_name}"
            self.vector_db_provider.delete_vector(dataset_id, source_name)
        except Exception as e:
            logging.info(f"Vectors not found: {e}")



    def delete_document_page_meta(self, dataset_id: str, file_name: str) -> bool:
        blob_path = f"{dataset_id}/{file_name}"
        try:
            #page_doc: PageMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=PageMetadataDBEntity, search={"blobPath": blob_path})
            page_docs: List[PageMetadataDBEntity] = self.metadata_db_provider.get_all(model=PageMetadataDBEntity, filter={"blobPath": blob_path})
            if not page_docs:
                logging.warn(f"Document not found in DB: {dataset_id}, {file_name}")
                return False
            else:
                for page_doc in page_docs:
                    logging.info(f"Found {page_doc} in page_doc..")
                    self.metadata_db_provider.delete(model=PageMetadataDBEntity, id=page_doc._id)
                    logging.info(f"Deleted document pagess entry: {dataset_id}, {file_name}")

            return True
        except Exception as e:
            logging.warning(f"No metadata found")
            return True
        
    def delete_document_meta(self, dataset_id: str, file_name: str) -> bool:
        logging.info(f"Deleting document pagess entry: {dataset_id}, {file_name}")
        blob_path = f"{dataset_id}/{file_name}"
        try:
            doc: DocumentMetadataDBEntity = self.metadata_db_provider.get_by_ref(model=DocumentMetadataDBEntity, search={"blobPath": blob_path})
            logging.info(f"Found {doc[0]} in doc..")
            if not doc:
                logging.warn(f"Document not found in DB: {dataset_id}, {file_name}")
                return False
            else:
                doc = doc[0]
            self.metadata_db_provider.delete(model=DocumentMetadataDBEntity, id=doc._id)
            logging.info(f"Deleted document total entry: {dataset_id}, {file_name}")
            return True
        except Exception as e:
            logging.warning(f"No metadata found")
            return True
        
        
        
        
    def delete_duplicate_from_db(self,dataset_id, file_name):
        status=self.vector_db_provider.delete_duplicate_vector(dataset_id, file_name)
        return status

    
    

from azure.storage.blob import BlobServiceClient

from src.exceptions import FunctionException
from src.config import DatasetServiceSA
import logging
class AzureBlobProvider:
    def __init__(self, connection_string: str):
        self.client = BlobServiceClient.from_connection_string(
            connection_string
        )

    def download_blob(self, container_name: str, blob_path: str, local_path: str):
        try:
            
            blob_client = self.client.get_blob_client(
                container=container_name,
                blob=blob_path
            )
            if not blob_client.exists():
                raise FunctionException(f"Blob {blob_path} does not exist")

            with open(local_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
        except Exception as e:
            raise FunctionException(str(e))
    def upload_blob(self, container_name: str, blob_path: str, local_path: str):
        try:
            blob_client = self.client.get_blob_client(
                container=container_name,
                blob=blob_path
            )
            if blob_client.exists():
                logging.info(f"Blob {blob_path} already exists. Skipping upload.")
                return True
            with open(local_path, "rb") as upload_file:
                blob_client.upload_blob(upload_file)
            #logging.info(f"Uploaded {local_path} to {blob_path}")
        except Exception as e:
            raise FunctionException(str(e))
        
    def delete_blob(self, container_name: str, blob_name: str):
        try:
            container_client = self.client.get_container_client(
                container=container_name
            )
            blobs_list = list(container_client.list_blobs(name_starts_with=blob_name))
            #logging.info(f"Deleting blobs: {blobs_list}")
            if blobs_list==[]:
                logging.warning(f"Blob {blob_name} does not exist")
            else:
                for blob in blobs_list:
                    container_client.delete_blob(blob)
        except Exception as e:
            raise FunctionException(str(e))
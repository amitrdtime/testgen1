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

        
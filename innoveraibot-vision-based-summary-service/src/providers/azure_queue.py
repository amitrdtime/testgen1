import json
import logging
import base64
from typing import Optional
from azure.storage.queue import QueueServiceClient, QueueClient, QueueMessage, BinaryBase64DecodePolicy, BinaryBase64EncodePolicy


class AzureQueueProvider:
    def __init__(self, connection_string: str, queue_name: str):
        self.client: QueueClient = QueueClient.from_connection_string(
            conn_str=connection_string, queue_name=queue_name,
            message_encode_policy = BinaryBase64EncodePolicy()
        )

    def send_message(self, message: str):
        if type(message) == dict:
            message = json.dumps(message)
        logging.info(f"Sending message to queue: {message}")
        message = base64.b64encode(message.encode("utf-8"))
        self.client.send_message(message)

import os
from src.repositories.ai import AIRepository
from src.repositories.document import DocumentRepository
from .dto import TrainDocumentRequest, TrainDocumentResponse
from src.providers.authorizer import validate_token
from src.entities.user import UserEntity
import logging
from src.config import AppConfig
from src.config import DocumentTrainingStatus


class TrainDocumentUseCase:
    def __init__(self, req: TrainDocumentRequest):
        self.req = req
        self.repo = AIRepository(req.dataset_id)
        self.document_repo = DocumentRepository()

    def execute(self) -> TrainDocumentResponse:
        if self.req.user_token!="":
            logging.info("validating token")
            user: UserEntity = validate_token(self.req.user_token, is_admin=False)
            
        document_name = os.path.basename(self.req.blob_path)
        logging.info("getting processed")
        # Delete vectors and summary and meta data before training if exists
        self.document_repo.delete_document_vector(self.req.dataset_id, document_name)
        self.repo.update_summary_service(self.req.dataset_id, document_name)
        self.document_repo.delete_document_meta(self.req.dataset_id, document_name)
        self.document_repo.delete_document_page_meta(self.req.dataset_id, document_name)
        self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.TRAINING)
        # Reduce the code duplication
        if AppConfig.training_method == "langchain":
            self.repo.update_langchain_training_service(self.req.document_id, self.req.blob_path, self.req.document_type)
            logging.info("successfully sent a message")
        elif AppConfig.training_method == "openai":
            self.repo.update_openai_training_service(self.req.document_id, self.req.blob_path, self.req.document_type)
        elif AppConfig.training_method == "multimodal":
            self.repo.update_multimodal_training_service(self.req.document_id, self.req.blob_path, self.req.document_type)
        return True
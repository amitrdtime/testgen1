import os
from src.repositories.ai import AIRepository
from src.repositories.document import DocumentRepository
from .dto import TrainLangchainDocumentRequest, TrainLangchainDocumentResponse
from src.providers.authorizer import validate_token
from src.entities.user import UserEntity
import logging
from src.config import DocumentTrainingStatus


class TrainLangchainDocumentUseCase:
    def __init__(self, req: TrainLangchainDocumentRequest):
        self.req = req
        self.repo = AIRepository(req)
        self.document_repo = DocumentRepository()

    def execute(self) -> TrainLangchainDocumentResponse:
        try:
            #user: UserEntity = validate_token(self.req.user_token, is_admin=False)
            logging.info("starting")
            local_path = self.document_repo.download_blob(self.req.blob_path)
            local_path=local_path.replace("\\","/")
            #document_name = os.path.basename(self.req.blob_path)
            # delete vectors before training if exists
            #self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.TRAINING)
        
            logging.info(f"Training started for ##{local_path}")
            status = self.repo.train(local_path)
            logging.info("end")
            if status and self.req.training_method == "langchain":
                logging.info("Updating summary service")
                self.repo.update_summary_service()
                self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.TRAINED)
        except Exception as e:
            self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.FAILED)
            raise e
        return TrainLangchainDocumentResponse(status)

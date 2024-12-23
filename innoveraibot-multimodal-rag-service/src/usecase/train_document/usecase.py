import os
from src.repositories.ai import AIRepository
from src.repositories.document import DocumentRepository
from .dto import TrainMultimodalDocumentRequest, TrainMultimodalDocumentResponse
from src.providers.authorizer import validate_token
from src.entities.user import UserEntity
import logging
from src.config import DocumentTrainingStatus


class TrainMultimodalDocumentUseCase:
    def __init__(self, req: TrainMultimodalDocumentRequest):
        self.req = req
        self.repo = AIRepository(req)
        self.document_repo = DocumentRepository(req.metadb_connection_string)

    def execute(self) -> TrainMultimodalDocumentResponse:
        # user: UserEntity = validate_token(self.req.user_token, is_admin=False)
        local_path = self.document_repo.download_blob(self.req.blob_path)
        local_path=local_path.replace("\\","/")
        try:
            logging.info(f"Training started for ##{self.req.blob_path}")
            self.repo.update_langchain_training_service(self.req)
            images_path = self.document_repo.extract_images(local_path)
            num_of_pages = len(images_path,)
            self.document_repo.save_file_meta_to_db(self.req.dataset_id, self.req.blob_path, num_of_pages,)
            logging.info(f"Images extracted ####{images_path}")
            for img in images_path:
                blob_path = f"{self.req.blob_path}/imgs/{os.path.basename(img)}"
                # page number is different for multimodal and gpt-4o models
                start = len("image_")  # start index of the number
                end = os.path.basename(img).index("_", start)  # end index of the number
                page_number = os.path.basename(img)[start:end]
                self.document_repo.upload_image_to_blob(img, blob_path)
                
                self.repo.update_image_service( self.req,page_number, blob_path)
            #if status:
                #self.repo.update_training_service(local_path, self.req.dataset_id)
                # self.repo.update_summary_service(local_path)
            self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.TRAINED)
        except Exception as e:
            self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.FAILED)
            raise e
        return TrainMultimodalDocumentResponse(True)

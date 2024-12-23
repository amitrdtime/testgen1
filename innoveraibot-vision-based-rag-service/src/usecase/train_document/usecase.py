import os
from src.repositories.document import DocumentRepository
from .dto import TrainOpenAIDocumentRequest, TrainOpenAIDocumentResponse
import logging
from src.config import DocumentTrainingStatus


class TrainOpenAIDocumentUseCase:
    def __init__(self, req: TrainOpenAIDocumentRequest):
        self.req = req
        
        self.document_repo = DocumentRepository(req.metadb_connection_string,req.openai_key)

    def execute(self) -> TrainOpenAIDocumentResponse:
        # user: UserEntity = validate_token(self.req.user_token, is_admin=False)
        try:
            local_path = self.document_repo.download_blob(self.req.blob_path)
            local_path=local_path.replace("\\","/")
            document_name = os.path.basename(self.req.blob_path)
            images_path = self.document_repo.get_image_from_pdf(local_path)
            num_of_pages=len(images_path)
            logging.info(f"Number of pages$$$: {num_of_pages}")
            # If the document is already trained, delete the existing metadata and start retraining
            self.document_repo.delete_document_page_meta(self.req.dataset_id, document_name)
            self.document_repo.delete_document_meta(self.req.dataset_id, document_name,)
            self.document_repo.save_file_meta_to_db(self.req.dataset_id, self.req.blob_path, num_of_pages,)
            for img in images_path:
                blob_path = f"{self.req.blob_path}/imgs/{os.path.basename(img)}"
                # page number is different for multimodal and gpt-4o models
                page_number,file_extension=os.path.splitext(os.path.basename(img))
                # datasetid/file.pdf/imgs/1.png
                self.document_repo.upload_image_to_blob(img, blob_path)
                logging.info(f"sending msg to the imag eservice again: {blob_path}")
                self.document_repo.update_image_service( self.req,page_number, blob_path, self.req.document_type,document_id=self.req.document_id)
        except Exception as e:
            self.document_repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.FAILED)
            raise e
            
            

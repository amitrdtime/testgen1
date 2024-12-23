import os
from src.repositories.ai import AIDocumentRepository
from src.repositories.image import DocumentImageRepository
from .dto import TrainImageRequest, TrainImageResponse
import logging
from src.config import DocumentTrainingStatus


class TrainImageUseCase:
    def __init__(self, req: TrainImageRequest):
        self.req = req
        self.repo = AIDocumentRepository(req)
        self.doc_repo = DocumentImageRepository(req)
    def execute(self) -> TrainImageResponse:
        # user: UserEntity = validate_token(self.req.user_token, is_admin=False)
        try:
            logging.info(f"Training image^^^^^: {self.req.blob_path}")
            local_path = self.doc_repo.download_img_blob(self.req.blob_path)
            document_name = self.req.blob_path.split("/")[1]
            metadata={"document_name":document_name,
                    "page_number":self.req.page_number,
                    "dataset_id":self.req.dataset_id}
            logging.info(f"Local path meta is: {metadata}")
            status = self.repo.train(self.req,local_path,metadata=metadata)
            #return the doc chunks values here and give that value for summarization
            logging.info(f"Training status : {status}")

            if status:
                file_blob_path = os.path.dirname(os.path.dirname(self.req.blob_path))
                # Add the page number information with document path into mongo db
                self.doc_repo.save_page_meta_to_db(file_blob_path, self.req.blob_path,self.req.page_number,status)
            #self.doc_repo.summarize_image_document(self.req.document_name, self.req.dataset_id)
            count_of_images_trained=self.doc_repo.trained_images_count(file_blob_path)
            logging.info(f"Count of images trained: {count_of_images_trained}")
            # Give this to image repositry class
            total_pages_of_pdf = self.doc_repo.total_pages_of_pdf(file_blob_path)
            logging.info(f"Total pages of pdf: {total_pages_of_pdf}")
            if count_of_images_trained == total_pages_of_pdf:
                logging.info("All docs training completed. Starting summarization")
                file_blob_path = os.path.dirname(os.path.dirname(self.req.blob_path))
                self.doc_repo.update_summary_service(file_blob_path)
                self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.TRAINED)
        except Exception as e:
            self.repo.update_dataset_service(self.req.document_id, DocumentTrainingStatus.FAILED)
            raise e
        return TrainImageResponse(status)

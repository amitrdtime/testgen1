import os
from src.repositories.document import SummaryRepository
from .dto import OpenAISummaryDocumentRequest, SummaryDocumentResponse
from src.providers.authorizer import validate_token
from src.entities.user import UserEntity
import logging
from src.config import DocumentSummaryStatus


class OpenAISummaryDocumentUseCase:
    def __init__(self, req: OpenAISummaryDocumentRequest):
        self.req = req
        self.summary_repo = SummaryRepository(req)
        

    def execute(self) -> SummaryDocumentResponse:
        # user: UserEntity = validate_token(self.req.user_token, is_admin=False)
        logging.info(f"Document Summarizing started {self.req.blob_path}")
        file_name = self.req.blob_path.split("/")[1]
        logging.info(f"File name : {file_name}")
        # local_path = self.summary_repo.download_blob(path)
        # local_path=local_path.replace("\\","/")
        try:
            logging.info("Document Summarizing started ***777&")
            self.summary_repo.summarize_document(file_name)
            logging.info("Document Summarizedsdd")
            #self.summary_repo.update_dataset_service(self.req.document_id, DocumentSummaryStatus.TRAINED)
        except Exception as e:
            self.summary_repo.update_dataset_service(self.req.document_id, DocumentSummaryStatus.FAILED)
            raise e
        return SummaryDocumentResponse(True)

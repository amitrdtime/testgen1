import os
from src.repositories.document import SummaryRepository
from .dto import LangchainSummaryDocumentRequest, SummaryDocumentResponse
from src.providers.authorizer import validate_token
from src.entities.user import UserEntity
import logging
from src.config import DocumentSummaryStatus


class LangchainSummaryDocumentUseCase:
    def __init__(self, req: LangchainSummaryDocumentRequest):
        self.req = req
        self.summary_repo = SummaryRepository(req)
        

    def execute(self) -> SummaryDocumentResponse:
        # user: UserEntity = validate_token(self.req.user_token, is_admin=False)
        
        local_path = self.summary_repo.download_blob(self.req.blob_path)
        local_path=local_path.replace("\\","/")
        try:
            logging.info("Document Summarizing started ***777&")
            self.summary_repo.summarize_document(local_path, self.req.dataset_id)
            logging.info("Document Summarizedsdd")
            #self.summary_repo.update_dataset_service(self.req.document_id, DocumentSummaryStatus.TRAINED)
        except Exception as e:
            self.summary_repo.update_dataset_service(self.req.document_id, DocumentSummaryStatus.FAILED)
            raise e
        return SummaryDocumentResponse(True)

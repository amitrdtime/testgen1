from .dto import DeleteDocumentVectorRequest, DeleteDocumentVectorResponse
from src.repositories.document import DocumentRepository
from src.repositories.ai import AIRepository

class DeleteDocumentVectorUseCase:
    def __init__(self, req: DeleteDocumentVectorRequest):
        self.req = req
        self.repo = DocumentRepository()
        self.ai_repo = AIRepository(req.dataset_id)
        
        
    def execute(self) -> DeleteDocumentVectorResponse:
        self.repo.delete_document_vector(self.req.dataset_id, self.req.file_name)
        self.repo.delete_document_meta(self.req.dataset_id, self.req.file_name)
        self.repo.delete_document_page_meta(self.req.dataset_id, self.req.file_name)
        self.ai_repo.update_summary_service(self.req.dataset_id, self.req.file_name)
        return DeleteDocumentVectorResponse(True)
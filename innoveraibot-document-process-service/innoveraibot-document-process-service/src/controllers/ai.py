import traceback
import logging
import json
import base64
import azure.functions as func
from src.exceptions import FunctionException

from src.usecase.train_document import TrainDocumentUseCase, TrainDocumentRequest
from src.usecase.delete_document_vector import DeleteDocumentVectorRequest, DeleteDocumentVectorUseCase
from src.config import TrainingServiceSA
# job for getting image from blob and create vector and store
ai_bp = func.Blueprint()


@ai_bp.function_name("fn_queue_training_job")
@ai_bp.queue_trigger(arg_name="msg", connection=None, queue_name=TrainingServiceSA.job_queue)
def fn_queue_training_job(msg: func.QueueMessage):
    try:
        logging.info(
            f"Received: {base64.b64decode(msg.get_body().decode('utf-8'))}")
        body = json.loads(base64.b64decode(msg.get_body().decode('utf-8')))
        if "job" in body:
            logging.info(f"Received the values%%%: {body}")
            if body["job"] == "DeleteDocumentVector":
                dto = DeleteDocumentVectorRequest(
                    dataset_id=body["datasetId"],
                    file_name=body["fileName"]
                )
                logging.info(f"Received the values adn deleting***: {dto}")
                usecase = DeleteDocumentVectorUseCase(dto)
                res = usecase.execute()
        
        else:
            dto = TrainDocumentRequest(
                dataset_id=body['datasetId'],
                document_id=body['documentId'],
                blob_path=body['blobPath'],
                document_type=body['documentType'],
            )
            
            usecase = TrainDocumentUseCase(dto)
            res = usecase.execute()
    except FunctionException as fe:
        logging.error(fe)
    except Exception as e:
        logging.error(e)


@ai_bp.route('ai/{datasetId}/{documentId}', methods=['POST'])
def fn_http_train_document(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
        dto = TrainDocumentRequest(
            dataset_id=req.route_params.get('datasetId'),
            document_id=req.route_params.get('documentId'),
            blob_path=body.get('blobPath'),
            document_type=body.get('documentType'),
            user_token=req.headers.get('x-user-token'),
        )
        logging.info(f"Received the values: and stratin #### {dto}")
        usecase = TrainDocumentUseCase(dto)
        res = usecase.execute()
        return func.HttpResponse(json.dumps(res), status_code=200)
    except FunctionException as fe:
        return fe.return_error()
    except Exception as e:
        logging.error(e)
        logging.error(traceback.format_exc())
        return func.HttpResponse("Unknown error", status_code=500)


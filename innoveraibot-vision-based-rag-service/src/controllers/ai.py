import logging
import json
import base64
import azure.functions as func
from src.exceptions import FunctionException
from src.usecase.train_document import TrainOpenAIDocumentUseCase, TrainOpenAIDocumentRequest
from src.config import OpenAITrainingServiceSA
from src.usecase.train_image import TrainImageUseCase, TrainImageRequest

# job for getting image from blob and create vector and store
ai_bp = func.Blueprint()


@ai_bp.function_name("fn_queue_openai_training_job")
@ai_bp.queue_trigger(arg_name="msg", connection=None, queue_name=OpenAITrainingServiceSA.job_queue)
def fn_queue_openai_training_job(msg: func.QueueMessage):
    try:
        logging.info(
            f"Received: {base64.b64decode(msg.get_body().decode('utf-8'))}")
        body = json.loads(base64.b64decode(msg.get_body().decode('utf-8')))
        if "job" in body and body["job"] == "DocumentImageTraining":
            dto = TrainImageRequest(
                job=body['job'],
                training_method=body['trainingMethod'],
                dataset_id=body['datasetId'],
                document_id=body['documentId'],
                blob_path=body['blobPath'],
                document_type=body['documentType'],
                page_number=body['pageNumber'],
                embedding_model_name=body['embeddingModelName'],
                max_tokens=body['maxTokens'],
                embedding_deployment=body['embeddingDeployment'],
                openai_model=body['openAIModel'],
                chunk_size=body['chunkSize'],
                openai_key=body['openAIKey'],
                num_list=body['numList'],
                dimensions=body['dimensions'],
                user_token=body['userToken'],
                vectordb_connection_string=body['vectorDBConnectionString'],
                db_type=body['dbType'],
                db_name=body['dbName'],
                index_name=body['indexName'],
                metadb_connection_string=body['metadbConnectionString'],
            )
            logging.info("material recieved########")
            usecase = TrainImageUseCase(dto)
            res = usecase.execute()
        
        else:
            dto = TrainOpenAIDocumentRequest(
                training_method=body['trainingMethod'],
                dataset_id=body['datasetId'],
                document_id=body['documentId'],
                blob_path=body['blobPath'],
                document_type=body['documentType'],
                embedding_model_name=body['embeddingModelName'],
                max_tokens=body['maxTokens'],
                embedding_deployment=body['embeddingDeployment'],
                openai_model=body['openAIModel'],
                chunk_size=body['chunkSize'],
                openai_key=body['openAIKey'],
                num_list=body['numList'],
                dimensions=body['dimensions'],
                user_token=body['userToken'],
                vectordb_connection_string=body['vectorDBConnectionString'],
                db_type=body['dbType'],
                db_name=body['dbName'],
                index_name=body['indexName'],
                metadb_connection_string=body['metadbConnectionString'],
            )
            logging.info("material recieved")
            usecase = TrainOpenAIDocumentUseCase(dto)
            res = usecase.execute()
    except FunctionException as fe:
        logging.error(fe)
    except Exception as e:
        logging.error(e)

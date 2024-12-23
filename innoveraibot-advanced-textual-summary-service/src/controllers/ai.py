import traceback
import logging
import json
import base64
from dataclasses import asdict
import azure.functions as func
from src.exceptions import FunctionException
from src.usecase.summary_document import LangchainSummaryDocumentUseCase, LangchainSummaryDocumentRequest, SummaryDocumentResponse
from src.config import LangchainSummaryServiceSA
# job for getting image from blob and create vector and store
ai_bp = func.Blueprint()


@ai_bp.function_name("fn_queue_langchain_summary_job")
@ai_bp.queue_trigger(arg_name="msg", connection=None, queue_name=LangchainSummaryServiceSA.job_queue)
def fn_queue_langchain_summary_job(msg: func.QueueMessage):
    try:
        logging.info(
            f"Received: {base64.b64decode(msg.get_body().decode('utf-8'))}")
        body = json.loads(base64.b64decode(msg.get_body().decode('utf-8')))
            #if body["job"]=="LangchainDocumentSummarization":
        dto = LangchainSummaryDocumentRequest(
                dataset_id=body['datasetId'],
                document_id=body['documentId'],
                blob_path=body['blobPath'],
                max_tokens=body['maxTokens'],
                openai_model=body['openAIModel'], 
                openai_key=body['openAIKey'],
                user_token=body['userToken'],
                db_name=body['dbName'],
                metadb_connection_string=body['metadbConnectionString'],
            )
        logging.info("material recieved")
        usecase = LangchainSummaryDocumentUseCase(dto)
        res = usecase.execute()
    except FunctionException as fe:
        logging.error(fe)
    except Exception as e:
        logging.error(e)

import os
 
 
class AzureB2CConfig:
    API_TOKEN_ROLE_KEY = os.environ.get("API_HEADER_ROLE_KEY", "extension_Role")
    API_TOKEN_USERNAME_KEY = os.environ.get("API_HEADER_USERNAME_KEY", "name")
    API_TOKEN_EMAIL_KEY = os.environ.get("API_HEADER_EMAIL_KEY", "extension_UserEmail")
    API_TOKEN_DISPLAY_NAME_KEY = os.environ.get("API_HEADER_DISPLAY_NAME_KEY", "name")
    API_TOKEN_ID_KEY = os.environ.get("API_HEADER_ID_KEY", "oid")
 

class DocumentTrainingStatus(str):
    QUEUED = "Queued"
    TRAINING = "Training"
    TRAINED = "Trained"
    FAILED = "Failed"
    SKIPPED = "Skipped"         
    
class LoggerKeys:
    TRAIN = "Training.Train"
 
class DatasetServiceSA:
    connection_string = os.environ.get("INNOVERAIBOT_DATASET_SERVICES_SA", os.environ.get("AzureWebJobsStorage", None))
    container = os.environ.get("INNOVERAIBOT_DATASET_DOCUMENT_STORE", "innoveraibot-document-store")
    job_queue = os.environ.get("INNOVERAIBOT_DATASET_JOB_QUEUE", "innoveraibot-dataset-service")
   
 
class LangchainTrainingServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_LANGCHAIN_TRAINING_JOB_QUEUE", "innoveraibot-langchain-training-service")
    
class SummaryServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_SUMMARY_JOB_QUEUE", "innoveraibot-summary-service")

import os
 
 
class AzureB2CConfig:
    API_TOKEN_ROLE_KEY = os.environ.get("API_HEADER_ROLE_KEY", "extension_Role")
    API_TOKEN_USERNAME_KEY = os.environ.get("API_HEADER_USERNAME_KEY", "name")
    API_TOKEN_EMAIL_KEY = os.environ.get("API_HEADER_EMAIL_KEY", "extension_UserEmail")
    API_TOKEN_DISPLAY_NAME_KEY = os.environ.get("API_HEADER_DISPLAY_NAME_KEY", "name")
    API_TOKEN_ID_KEY = os.environ.get("API_HEADER_ID_KEY", "oid")
 
class VectorDB:
    connection_string = os.getenv("VECTOR_DB_CONNECTION_URI")
    db_type = "mongodb-cosmos"
    db_name = os.getenv("VECTOR_DB_NAME", "innoveraibot-training-service")
    index_name = "llm_index"
 
class MetaDataDBConfig(str):
    connection_string: str = os.environ.get("METADATA_DB_CONNECTION_URI", os.environ.get("MONGODB_URI", None))    
 
class LangChainConfig(str):
    embedding_model_name = os.getenv("OPENAI_EMBEDDINGS_MODEL_NAME", "text-embedding-ada-002")
    max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", 2048))
    embedding_deployment = os.getenv("OPENAI_EMBEDDINGS_DEPLOYMENT", "smart-agent-embedding-ada")
    openai_key = os.getenv("OPENAI_API_KEY")
    num_list = int(os.getenv("OPENAI_NUM_LISTS", 100))
    chunk_size = int(os.getenv("OPENAI_CHUNK_SIZE", 1))
    dimensions = int(os.getenv("OPENAI_DIMENSIONS", 1536))
    openai_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    system_prompt = os.getenv("OPENAI_SYSTEM_PROMPT", """You are a helpful assistant providing the information related to user's query.Use the following pieces of context to answer the question.
                If the context is related to previous conversation try to find the response based on the chat history ,else consider it as Standalone Question.
                Provide more descriptive responses explaining in detail about the context provided.
        Context: {context} ----------
        Question: {question} ----------
        Chat History:{chat_history} ----------
        Try to be more friendly and get the responses in most of the cases out of the context provided.
        If you cannot find the answer from the pieces of context or If the information is not in the provided source, just say that "It looks like didn't provide any
        specific context or question. How can I assist you today? If you have a specific topic or question in mind, please provide more details so I can better help you.",
        Don't try to make up an answer.Just follow the context provided dont look answer outside.Provide the response only in english language.Even if the generic questions asked, you should not answer based on your own knowledge.
        """)
    enable_reranker = bool(int(os.getenv("OPENAI_ENABLE_RERANKER", "false") == "true"))
    search_kwarg_k = int(os.getenv("OPENAI_SEARCH_K", 8))
    search_type = os.getenv("OPENAI_SEARCH_TYPE", "mmr")
    enable_source_sender = bool(int(os.getenv("OPENAI_ENABLE_SOURCE_SENDER", "false") == "true"))

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
    
class TrainingServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_TRAINING_JOB_QUEUE", "innoveraibot-training-service")
    
class OpenAITrainingServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_OPENAI_TRAINING_JOB_QUEUE", "innoveraibot-openai-training-service")
    
class MultimodalTrainingServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_MULTIMODAL_TRAINING_JOB_QUEUE", "innoveraibot-multimodal-training-service")
    

class SummaryServiceSA:
    connection_string = os.getenv("AzureWebJobsStorage")
    job_queue = os.environ.get("INNOVERAIBOT_SUMMARY_JOB_QUEUE", "innoveraibot-summary-service")
    
class AppConfig:
    training_method = os.getenv("TRAINING_MODEL", "langchain")

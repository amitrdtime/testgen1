import json
import re
import logging
from typing import List, Any, Dict, Tuple
from datetime import datetime
from openai import OpenAI
import time
import os
import pymongo
#from .ibase import IBaseAIProvider
#from langchain.schema.vectorstore import VectorStoreRetriever
#from langchain.callbacks.manager import CallbackManagerForRetrieverRun
#from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.vectorstores.azure_cosmos_db import (
    AzureCosmosDBVectorSearch,
)
from langchain.docstore.document import Document
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.prompts import PromptTemplate
from src.config import LoggerKeys

from langchain.chains.llm import LLMChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains import MapReduceDocumentsChain, ReduceDocumentsChain
from langchain_core.messages import HumanMessage, AIMessage
from langchain.memory import ConversationBufferMemory, ChatMessageHistory
from src.usecase.summary_document.dto import OpenAISummaryDocumentRequest

class LangChainAIProvider():
    def __init__(self,req:OpenAISummaryDocumentRequest):
        self.max_tokens = req.max_tokens
        self.openai_model = req.openai_model
        self.openai_key=req.openai_key

        map_summary_template = """Write a concise summary of the following content:

        {content}

        Summary:
        """
        reduce_summary_template = """The following is set of summaries:

        {doc_summaries}

        Summarize the above summaries with all the key details
        Summary:"""

        self.map_summary_prompt = PromptTemplate.from_template(map_summary_template)
        self.reduce_summary_prompt = PromptTemplate.from_template(reduce_summary_template)
        
    
    def __get_llm(self) -> ChatOpenAI:
        return ChatOpenAI(
            model_name=self.openai_model,
            max_tokens=self.max_tokens,
            openai_api_key=self.openai_key,
            temperature=0.0,
            streaming=True,
        )

    def get_summary(self, chunks: List[Document]) -> Tuple[str, str]:
        """Getting document summary by passing list of documents

        Args:
            chunks (List[Document]): Document chunks

        Returns:
            str: Generated Summary
        """        
        map_chain = LLMChain(prompt=self.map_summary_prompt, llm=self.__get_llm())
        reduce_chain = LLMChain(prompt=self.reduce_summary_prompt, llm=self.__get_llm())
        stuff_chain = StuffDocumentsChain(llm_chain=reduce_chain, document_variable_name="doc_summaries")
        reduce_chain = ReduceDocumentsChain(combine_documents_chain=stuff_chain)
        map_reduce_chain = MapReduceDocumentsChain(llm_chain=map_chain,document_variable_name="content",reduce_documents_chain=reduce_chain)
       
        logging.info(f"Number of chunks passed to get the summary => {len(chunks)}")
        summary = map_reduce_chain.invoke(chunks)
        logging.debug(f"Summary: {summary}")
        file_name: str = os.path.basename(chunks[0].metadata["source"])
        logging.info(json.dumps({  
            LoggerKeys.SUMMARY: "LangChainAIProvider.get_summary",
            "timeStamp": str(datetime.utcnow().isoformat()),
            "file": file_name,
            "summary": summary["output_text"],
            "inputChunks": len(chunks)
         }))
        
        return file_name, summary["output_text"]
    
    
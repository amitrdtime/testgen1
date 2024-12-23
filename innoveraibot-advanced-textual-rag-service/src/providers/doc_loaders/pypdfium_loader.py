from langchain_community.document_loaders import PyPDFium2Loader
from .ibase import IBaseDocLoader
from langchain.docstore.document import Document
from typing import List


class PyPDFiumLoader():
    def __init__(self):
        ...

    def load(self, file_path: str) -> List[Document]:
        loader = PyPDFium2Loader(file_path)
        return loader.load()
    

if __name__ == "__main__":
    loader = PyPDFiumLoader()
    documents = loader.load("C:/Users/inn847/Downloads/HRPolicy.pdf")
    print(documents)
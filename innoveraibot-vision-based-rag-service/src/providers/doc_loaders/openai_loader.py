from langchain.docstore.document import Document
import logging
import os
from typing import List, Any, Dict
import base64
import io
import openai
from mimetypes import guess_type
import pypdfium2
from src.config import OpenAITrainingServiceSA, AppConfig
from src.providers.azure_queue import AzureQueueProvider
from PIL import Image
import fitz
# from src.usecase.train_image.dto import TrainImageRequest


class OpenAILoader():
    def __init__(self,openai_key:str):
        self.genai_queue_provider = AzureQueueProvider(
            OpenAITrainingServiceSA.connection_string, OpenAITrainingServiceSA.job_queue)
        self.images: List[Any] = []
        self.client = openai.OpenAI(api_key=openai_key) 
    
    def load(self, file_path: str, metadata: Dict[str, Any]) -> List[Document]:
        image_url=self.local_image_to_data_url(file_path)
        doc_chunks=[]
        retry=True
        while retry:
            try:
                data=self.get_summary(image_url)
                doc_chunks = self.doc_to_chunks(data,metadata['page_number'],metadata['document_name'],metadata['dataset_id'])
                retry=False
                return doc_chunks
            except Exception as e:
                # Image size exceeded 20mb error to be handled
                logging.error(f"Error in loading image to vision api: {e}")
                retry=False
                return doc_chunks

    
    def doc_to_chunks(self,data, page_number, pdf_name, dataset_id):
        doc_chunks = []
        if isinstance(data, str):
                # Take a single string as one page
                text = [data]
        page_docs = [Document(page_content=page) for page in text]
        doc_chunks = []
        #date = datetime.now()
        #current_datetime = date.strftime("%Y-%m-%d")
        source = f"/tmp/{dataset_id}/{pdf_name}"
        source = source.replace("\\", "/")
        for doc in page_docs:
            doc = Document(
                        page_content=doc.page_content, metadata={}
                    )
            doc.metadata["page"] = page_number
            doc.metadata["source"] = source
            doc_chunks.append(doc) 
            # text_splitter = RecursiveCharacterTextSplitter(
            #     chunk_size=500,
            #     separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
            #     chunk_overlap=30,
            #     length_function=len,
            #     is_separator_regex=False,
            # )
            # chunks = text_splitter.split_text(doc.page_content)
            # source = "/tmp\\{}/{}".format(dataset_id, pdf_name)
            # if len(chunks) != 0:
            #     for i, chunk in enumerate(chunks):
            #         doc = Document(
            #             page_content=chunk, metadata={}
            #         )
            #         doc.metadata["chunk"] = i
            #         doc.metadata["page"] = page_number
            #         doc.metadata["source"] = source
            #         doc.metadata["created_date"] = current_datetime

            #         doc_chunks.append(doc)
        return doc_chunks
    
    def get_summary(self, image_url: str) -> str:
        # In multimodal case, we consider gpt-4o as gpt image extraction model
        training_gpt_model=AppConfig.gpt_model 
        custom_prompt="""Extract all the information from the image and give me all the visible text in that image without spelling modification. 
                        Give me all the text that you could extract but do not use other information out of the image to produce the result.
                        If there is table, analyze the table content according to the rows, columns and provide me all the knowledge you could get out of that table including the numbers and their units."""
        response = self.client.chat.completions.create(
            model=training_gpt_model,
            #model="gpt-4-vision-preview", #configure it .gpt-4o can be used OPENAI_VISION_MODEL
            messages=[
                {
                    "role": "user",
                    "content":
                    [
                        {"type": "text", "text": custom_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url":image_url
                            }
                        }
                    ]
                }
            ],
            max_tokens=4096
        )

        logging.info(response.usage.total_tokens)
        return (response.choices[0].message.content)

    # Function to encode a local image into data URL
    def local_image_to_data_url(self, image_path):
        # Guess the MIME type of the image based on the file extension
        mime_type, _ = guess_type(image_path)
        if mime_type is None:
            mime_type = 'application/octet-stream'  # Default MIME type if none is found

        # Read and encode the image file
        with open(image_path, "rb") as image_file:
            base64_encoded_data = base64.b64encode(
                image_file.read()).decode('utf-8')

        # Construct the data URL
        return f"data:{mime_type};base64,{base64_encoded_data}"

    

    def pdf_to_image(self, file_path: str) -> List[str]:
        logging.info(f"File path: {file_path}")
        output_images = []
        dir_name, pdf_name = os.path.split(file_path)
        pdf_name = os.path.splitext(pdf_name)[0]
        image_dir = os.path.join(dir_name, pdf_name,'imgs')
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)
        pdf = pypdfium2.PdfDocument(file_path)
        logging.info(f"PDF loaded: {pdf}")
        n_pages = len(pdf)
        logging.info(f"Number of pages: {n_pages}")
        for page_number in range(n_pages):
            page = pdf.get_page(page_number)
            pil_image = page.render(scale = 4).to_pil()
            logging.info(f"Image loaded")
            image_path = os.path.join(image_dir, f'{page_number}.png')
            pil_image.save(image_path)
            logging.info(f"Image saved: {image_path}")
            output_images.append(image_path)   
        logging.info(f"Images extracted: {output_images}")
            # save image to file
        return output_images
   
   
    def extract_images(self,file_path:str)->List[Any]:
        pdf_file = fitz.open(file_path) 
        extracted_images = []
        dir_name, pdf_name = os.path.split(file_path)
        pdf_name = os.path.splitext(pdf_name)[0]
        image_dir = os.path.join(dir_name, pdf_name,'imgs')
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)
        for page_index in range(len(pdf_file)): 
            # get the page itself 
            page = pdf_file[page_index] 
            image_list = page.get_images() 
            for image_index, img in enumerate(image_list, start=1): 
                # get the XREF of the image 
                xref = img[0]
                # extract the image bytes 
                base_image = pdf_file.extract_image(xref) 
                image_bytes = base_image["image"] 
                # create an image PIL object
                image = Image.open(io.BytesIO(image_bytes))
                # save the image to the directory
                single_image_path=os.path.join(image_dir, f'image_{page_index}_{image_index}.png')
                image.save(single_image_path)
                extracted_images.append(single_image_path)
        return extracted_images


# if __name__ == "__main__":
#     loader = OpenAILoader()
#     documents = loader.pdf_to_image(
#         "C:/Users/inn448/Downloads/INFY q2-2024.pdf")
#     print(documents)

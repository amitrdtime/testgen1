import logging
import os
from typing import List, Any
# from .ibase import IBaseDocLoader
from langchain.docstore.document import Document
import pypdfium2
import base64
import io
import openai
from mimetypes import guess_type


class OpenAISummaryLoader():
    def __init__(self):
        self.images: List[Any] = []
        self.client = openai.OpenAI()

    def load(self, file_path: str) -> List[Document]:
        images = self.pdf_to_image(file_path)
        summaries = self.image_to_summary()
        documents = []
        for i, image in enumerate(images):
            documents.append(Document(image, summaries[i]))
        return documents

    def get_summary(self, image_url: str) -> str:
        logging.info(f"Image URL: {image_url}")
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content":
                    [
                        {"type": "text", "text": """Extract all the information from the image and give me all the visible text in that image without spelling modification. 
                        Give me all the text that you could extract but do not use other information out of the image to produce the result.
                        If there is table, analyze the table content according to the rows, columns and provide me all the knowledge you could get out of that table."""},
                        {
                            "type": "image_url",
                            "image_url": image_url
                        }
                    ]
                }
            ],
            max_tokens=4096
        )

        print(response.usage.total_tokens)

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

    def image_to_summary(self):
        summaries: List[str] = []
        for i, image in enumerate(self.images):
            image.save(f"page_{i}.jpg")
            logging.info(f"File saved")
            img_str = self.local_image_to_data_url(f"page_{i}.jpg")
            logging.info(f"Got the image URL: {img_str}")
            summaries.append(self.get_summary(img_str))
        return summaries

    def pdf_to_image(self, file_path: str) -> List[str]:
        p = pypdfium2.PdfDocument(file_path)
        for i in range(len(p)):
            pg = p[i]
            print(i)
            image = pg.render(scale=4).to_pil()

            image_size = image.size
            new_size = (int(image_size[0] / 4), int(image_size[1] / 4))

            print(f"Image resolution => {image.size}")
            print(f"New resolution => {new_size}")

            image = image.resize(new_size)
            self.images.append(image)

            # save image to file

        return self.images


if __name__ == "__main__":
    loader = OpenAISummaryLoader()
    documents = loader.pdf_to_image(
        "C:/Users/inn847/Downloads/INFY q2-2024.pdf")
    print(documents)

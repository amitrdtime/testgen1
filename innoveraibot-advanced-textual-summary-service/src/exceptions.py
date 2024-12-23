import json
import azure.functions as func


class FunctionException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message, self.status_code)
        self.error = json.dumps({
            "error": self.message,
            "statusCode": self.status_code
        })

    def return_error(self):
        return func.HttpResponse(
            self.error, 
            status_code=self.status_code, 
            mimetype="application/json"
        )

import logging
import azure.functions as azfunc
import jwt
from src.config import AzureB2CConfig
from src.exceptions import FunctionException
from src.entities.user import UserEntity


def validate_token(token: str, is_admin: bool) -> UserEntity:
    try:
        token = token.split(' ')[1]
        decoded_jwt = jwt.decode(
            token, options={"verify_signature": False}, algorithms=['RS256'])
    except jwt.ExpiredSignatureError as e:
        raise ValueError("Token expired")
    except Exception as e:
        raise ValueError("Invalid token")
    if AzureB2CConfig.API_TOKEN_ROLE_KEY not in decoded_jwt:
        raise ValueError("Role not exists")
    if is_admin and decoded_jwt[AzureB2CConfig.API_TOKEN_ROLE_KEY] != 'Admin':
        raise ValueError("Unauthorized")
    logging.info(decoded_jwt)
    return UserEntity(
        id=decoded_jwt[AzureB2CConfig.API_TOKEN_ID_KEY],
        username=decoded_jwt[AzureB2CConfig.API_TOKEN_USERNAME_KEY],
        email=decoded_jwt[AzureB2CConfig.API_TOKEN_EMAIL_KEY],
        display_name=decoded_jwt[AzureB2CConfig.API_TOKEN_DISPLAY_NAME_KEY],
        role=decoded_jwt[AzureB2CConfig.API_TOKEN_ROLE_KEY]
    )


def admin_only(func):
    '''Log the date and time of a function'''
    def wrapper(req: azfunc.HttpRequest):
        token = req.headers.get('x-user-token')
        if not token:
            return azfunc.HttpResponse("Unauthorized", status_code=401)
        try:
            validate_token(token, True)
        except ValueError as e:
            return azfunc.HttpResponse("Unauthorized", status_code=401)
        except Exception as e:
            return azfunc.HttpResponse("Internal Server Error", status_code=500)
        return func(req)
    return wrapper


from dataclasses import dataclass


@dataclass
class UserEntity:
    username: str
    id: str = ""
    email: str = ""
    display_name: str = ""
    db_obj = None
    role: str = "User"

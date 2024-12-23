import json
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class UserEntity:
    username: str
    id: str = ""
    email: str = ""
    display_name: str = ""
    db_obj = None
    role: str = "User"

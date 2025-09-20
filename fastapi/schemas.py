from typing import List, Optional
from pydantic import BaseModel, EmailStr
import datetime
import enum

# Basic schemas


class RoleEnum(str, enum.Enum):
    builder = "builder"

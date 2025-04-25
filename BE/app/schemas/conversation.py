from pydantic import BaseModel
from datetime import datetime
import json


class ConversationRequest(BaseModel):
    query: str

class ConversationResponse(BaseModel):
    answer: json    

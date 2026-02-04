from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    options: List[str]
    human: bool
    service: str
    step: str

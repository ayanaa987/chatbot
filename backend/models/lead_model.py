# models/lead_model.py

from pydantic import BaseModel
from datetime import datetime

class Lead(BaseModel):
    session_id: str
    name: str
    email: str
    phone: str | None = None
    requirement: str
    created_at: datetime = datetime.utcnow()

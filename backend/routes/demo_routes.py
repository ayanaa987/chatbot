from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class DemoBooking(BaseModel):
    name: str
    email: str
    requirement: str
    date: str
    time: str

@router.post("/book-demo")
def book_demo(data: DemoBooking):
    demo_bookings_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "requirement": data.requirement,
        "date": data.date,
        "time": data.time,
        "status": "booked",
        "created_at": datetime.utcnow()
    })

    return {
        "status": "success",
        "message": "Demo booked successfully"
    }

from pymongo import MongoClient
from config import MONGO_URI, DB_NAME
from datetime import datetime
# ================= MONGODB CONNECTION =================
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
demo_bookings_collection = db["demo_bookings"] 
# ================= COLLECTIONS =================
conversations_collection = db["conversations"]
leads_collection = db["leads"]

# ================= SAVE CHAT MESSAGES =================
def save_message(session_id: str, sender: str, message: str):
    """
    Save user/bot messages for a session
    """
    conversations_collection.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "from": sender,        # 'user' or 'bot'
                    "text": message,
                    "time": datetime.utcnow()
                }
            },
            "$set": {"updated_at": datetime.utcnow()},
            "$setOnInsert": {"created_at": datetime.utcnow()}
        },
        upsert=True
    )

# ================= SAVE LEADS =================
def save_lead(
    session_id: str,
    name: str,
    email: str,
    phone: str,
    interest: str,
    requirement: str
):
    """
    Save captured leads from chatbot
    """
    leads_collection.insert_one({
        "session_id": session_id,
        "name": name,
        "email": email,
        "phone": phone,
        "interest": interest,
        "requirement": requirement,
        "source": "chatbot",
        "created_at": datetime.utcnow()
    })

# ================= GET CONVERSATION =================
def get_conversation(session_id: str):
    """
    Fetch full conversation for a session
    """
    return conversations_collection.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )

# ================= GET ALL LEADS =================
def get_all_leads():
    """
    Fetch all captured leads
    """
    return list(
        leads_collection.find({}, {"_id": 0}).sort("created_at", -1)
    )

# ================= CLEAR CONVERSATION =================
def clear_conversation(session_id: str):
    """
    Delete conversation by session_id
    """
    conversations_collection.delete_one({"session_id": session_id})

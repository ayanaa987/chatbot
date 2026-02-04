from fastapi import APIRouter
from database import conversations_collection, leads_collection

router = APIRouter()

# =======================
# 📊 ADMIN STATS
# =======================
@router.get("/stats")
def admin_stats():
    total_chats = conversations_collection.count_documents({})
    total_sessions = len(
        conversations_collection.distinct("session_id")
    )
    total_leads = leads_collection.count_documents({})

    return {
        "total_chats": total_chats,
        "total_sessions": total_sessions,
        "total_leads": total_leads
    }


# =======================
# 🧵 ALL CHATS
# =======================
@router.get("/chats")
def get_chats():
    return list(
        conversations_collection.find({}, {"_id": 0})
    )


# =======================
# 📋 ALL LEADS
# =======================
@router.get("/leads")
def get_leads():
    return list(
        leads_collection.find({}, {"_id": 0})
    )

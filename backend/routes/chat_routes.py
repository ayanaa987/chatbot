from fastapi import APIRouter
from bot_logic import get_bot_response
from database import leads_collection, conversations_collection

router = APIRouter()

@router.post("/")
def chat(data: dict):
    session_id = data.get("session_id")
    message = data.get("message")

    if not session_id or not message:
        return {
            "title": "",
            "reply": "Invalid request.",
            "options": [],
            "human": False,
            "step": "error"
        }

    # Get bot reply
    bot_response = get_bot_response(session_id, message)

    # ✅ Save conversation
    conversations_collection.insert_one({
        "session_id": session_id,
        "user_message": message,
        "bot_reply": bot_response.get("reply"),
        "step": bot_response.get("step")
    })

    # ✅ SAVE LEAD (CORRECT WAY)
    if bot_response.get("step") == "save_lead":
        lead = bot_response.get("lead", {})

        leads_collection.insert_one({
            "session_id": session_id,
            "name": lead.get("name"),
            "email": lead.get("email"),
            "phone": lead.get("phone"),
            "requirement": bot_response.get("requirement")
        })

    return bot_response

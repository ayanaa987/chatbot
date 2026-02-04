# bot_logic.py
import re
from datetime import datetime
from knowledge_base import KNOWLEDGE
from database import conversations_collection, demo_bookings_collection, leads_collection
from database import db
USER_CONTEXT = {}
# ================= GPT FALLBACK =================
def gpt_fallback(user_message: str):
    return (
        "I understand your question \n\n"
        "You can ask me about:\n"
        "• Company information\n"
        "• Services & pricing\n"
        "• Website & app development\n"
        "• Digital marketing\n"
        "• Hardware & IT support\n"
        "• AI automation\n\n"
        "Please choose an option below "
    )


# ================= RESPONSE FORMAT =================
def response(title, text, options, context=None, session_id=None):
    if context and session_id:
        USER_CONTEXT[session_id] = context

    return {
        "title": title,
        "reply": text,
        "message": text,
        "options": options,
        "buttons": options,
        "human": False,
        "step": "general"
    }
def main_options():
    return [
        "Company Info",
        "Services",
        "Website Development",
        "Digital Marketing",
        "Hardware Support",
        "AI Support",          # ✅ ADD THIS
        "Cloud Services",      # ✅ ADD THIS (new)
        "Pricing",
        "Talk to Agent"
    ]

# ================= SMART GREETING =================
def smart_greeting(session_id):
    hour = datetime.now().hour
    greet = "Good morning" if hour < 12 else "Good evening"

    existing = conversations_collection.find_one({"session_id": session_id})
    if existing:
        return f"{greet}! Welcome back. How can I help you today?"
    return f"{greet}! I’m Ninzex AI Assistant. How can I help you today?"


# ================= INTENT KEYWORDS =================
INTENTS = {
    "company": ["company", "about", "ninzex", "who are you"],
    "services": ["services", "what do you offer", "solutions"],
    "website": ["website", "web", "web development", "site"],
    "marketing": ["marketing", "seo", "ads", "promotion"],
    "hardware": ["hardware", "repair", "laptop", "computer", "it support"],
    "ai": ["ai", "chatbot", "automation"],
    "cloud": ["cloud", "aws", "server", "hosting", "deployment"],  # ✅ NEW
    "pricing": ["price", "pricing", "cost", "charges", "rate", "amount"],
    "demo": ["demo", "meeting", "book demo"]
}

def detect_intent(message: str):
    msg = message.lower()
      # 🔥 HIGH PRIORITY (check first)
    if "cloud" in msg:
        return "cloud"

    if "ai" in msg:
        return "ai"
    
    for intent, words in INTENTS.items():
        for w in words:
            if w in msg:
                return intent
    return None
# ================= MAIN BOT LOGIC =================
def get_bot_response(session_id: str, user_message: str):
    msg = user_message.lower().strip()

    # ===== FIRST GREETING =====
    if msg in ["hi", "hello", "hey", "start"]:
        return response("Welcome", smart_greeting(session_id), main_options())
    
    # ===== LEAD AUTO CAPTURE =====
    email = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", user_message)
    phone = re.search(
    r"\b(\+91[\s-]?)?(0)?[6-9]\d{9}\b",
    user_message
)

    if email or phone:
        lead_data = {
            "session_id": session_id,
            "name": "Customer",
            "email": email.group() if email else "",
            "phone": phone.group() if phone else "",
            "requirement": user_message,
            "source": "chatbot",
            "status": "new",
            "created_at": datetime.utcnow()
        }

        leads_collection.insert_one(lead_data)

        return {
            "title": "✅ Lead Received",
            "reply": (
                "Thank you! 🙌\n\n"
                "Your details have been received.\n\n"
                "📞 +91 87654320298\n"
                "📧 contactus@ninzex.com\n\n"
                "Our team will contact you shortly."
            ),
            "options": [],
            "buttons": [],
            "human": True,
            "step": "lead_saved"
        }
    # ===== NEGATIVE SENTIMENT =====
    if any(w in msg for w in ["angry", "complaint", "refund", "worst"]):
        return {
            "reply": "I’m sorry for the inconvenience 😔. Let me connect you to a human agent.",
            "options": [],
            "human": True
        }

    # ===== DEMO BOOKING FLOW =====
    if msg in ["book demo", "demo", "meeting"]:
        return {
            "reply": " Please select when you want to book your demo ",
            "options": ["Today", "Tomorrow", "This Week"],
            "step": "demo_booking",
            "human": False
        }

    if msg in ["today", "tomorrow", "this week"]:
        demo_bookings_collection.insert_one({
            "session_id": session_id,
            "slot": msg,
            "created_at": datetime.now()
        })

        return {
            "reply": f"Your demo is scheduled for **{msg.title()}**.\n\n📞 Our team will contact you shortly.",
            "options": main_options(),
            "step": "demo_confirmed",
            "human": False
        }

       # ===== TALK TO AGENT =====
    if msg in ["talk to agent", "agent", "human", "call me"]:
     return {
        "title": "Talk to Agent",
        "reply": KNOWLEDGE["agent"],
        "options": main_options(),   # ✅ KEEP MENU
        "buttons": main_options(),
        "human": True,
        "step": "agent"
    }
    # ===== SMART INTENT HANDLER =====
    intent = detect_intent(msg)

    # ---------- COMPANY ----------
    if intent == "company":
        return response(
            "Company Info",
            KNOWLEDGE["company"],
            main_options(),
            context="company",
            session_id=session_id
        )

    # ---------- SERVICES ----------
    if intent == "services":
        return response(
            "Our Services",
            KNOWLEDGE["services"],
            main_options(),
            context="services",
            session_id=session_id
        )

    # ---------- WEBSITE ----------
    if intent == "website":
        return response(
            "Website Development",
            KNOWLEDGE["website"],
            ["Pricing", "Book Demo", "Talk to Agent"],
            context="website",
            session_id=session_id
        )

    # ---------- DIGITAL MARKETING ----------
    if intent == "marketing":
        return response(
            "Digital Marketing",
            KNOWLEDGE["marketing"],
            ["Pricing", "Book Demo", "Talk to Agent"],
            context="marketing",
            session_id=session_id
        )

    # ---------- HARDWARE ----------
    if intent == "hardware":
        return response(
            "Hardware Support",
            KNOWLEDGE["hardware"],
            ["Pricing", "Book Demo", "Talk to Agent"],
            context="hardware",
            session_id=session_id
        )

    # ---------- AI ----------
    if intent == "ai":
        return response(
            "AI Support",
            KNOWLEDGE["ai"],
            ["Pricing", "Book Demo", "Talk to Agent"],
            context="ai",
            session_id=session_id
        )

    # ---------- CLOUD SERVICES ----------
    if intent == "cloud":
     return response(
        "Cloud Services",
        KNOWLEDGE["cloud"],
        ["Pricing", "Book Demo", "Talk to Agent"],
        context="cloud",
        session_id=session_id
    )

    # ---------- PRICING (CONTEXT-AWARE) ----------
    if intent == "pricing":
        context = USER_CONTEXT.get(session_id)

        if context == "website":
            return response(
                "Website Pricing",
                KNOWLEDGE["pricing_website"],
                ["Book Demo", "Talk to Agent"]
            )

        if context == "marketing":
            return response(
                "Marketing Pricing",
                KNOWLEDGE["pricing_marketing"],
                ["Book Demo", "Talk to Agent"]
            )

        if context == "hardware":
            return response(
                "Hardware Pricing",
                KNOWLEDGE["pricing_hardware"],
                ["Book Demo", "Talk to Agent"]
            )

        if context == "cloud":
         return response(
           "Cloud Pricing",
           KNOWLEDGE["pricing_cloud"],
           ["Book Demo", "Talk to Agent"]
         )


        if context == "ai":
            return response(
                "AI Pricing",
                KNOWLEDGE["pricing_ai"],
                ["Book Demo", "Talk to Agent"]
            )

        return response(
            "Pricing",
            "Please choose a service to see pricing 👇",
            ["Website Development", "Digital Marketing", "Hardware Support", "AI Support"]
        )

    # ---------- FINAL FALLBACK ----------
    return response(
        "🤖 Ninzex AI",
        gpt_fallback(user_message),
        main_options()
    )

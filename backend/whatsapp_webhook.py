# whatsapp_webhook.py
from fastapi import FastAPI, Request, HTTPException
from database import conversations_collection

import requests

app = FastAPI()

# ⚡ Directly use your token and phone number
WHATSAPP_TOKEN = "EAA4ZBhlNf5mcBQhx3EBVygQYT3NSYIHk26GUJ2kTAen8bG1ZBdSybcgo4TtpE1JU4fsNPs2MJy1cQZA6SHYMC1XImTPQkxWTLpu4PUUpqAFCCi9pebWmGXxZCRv0UZCvSpjxTnW8ZCcoDZA2vblhYysbJvYyZAjBvWcDxMGYxdloTN0LgAADwTjS8bumnVrgOJ1qgPhDbmKfq06Yc21wB8QodT38ShUUtmK3oSMGBGsiz2KdZBODw8upkxwbe5MRjtHYUYZAuY8FpaSri7gWSZB7c8n"
PHONE_NUMBER_ID = "1055948144261177"
VERIFY_TOKEN = "mysecret123"

@app.get("/")
async def root():
    return {"message": "WhatsApp Webhook API is running!"}

# Webhook verification
@app.get("/whatsapp/webhook")
async def verify_webhook(hub_mode: str = None, hub_challenge: str = None, hub_verify_token: str = None):
    if hub_verify_token == VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Invalid verification token")

# Webhook to receive WhatsApp messages
@app.post("/whatsapp/webhook")
async def receive_message(request: Request):
    data = await request.json()
    print("Incoming webhook:", data)

    try:
        entry = data["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]

        if "messages" in value:
            message_data = value["messages"][0]
            phone_number = message_data["from"]
            message_text = message_data["text"]["body"]

            # 🔗 Use SAME chatbot logic as website
            from bot_logic import get_bot_response

            bot_response = get_bot_response(
                session_id=f"whatsapp_{phone_number}",
                user_message=message_text
            )

            reply_text = bot_response.get(
                "reply",
                "Thank you for contacting Ninzex Solutions!"
            )

            # 📤 Send reply to WhatsApp
            send_whatsapp_message(phone_number, reply_text)

            # 💾 SAVE CONVERSATION IN MONGODB  ✅ HERE IS THE ANSWER
            conversations_collection.insert_one({
                "session_id": f"whatsapp_{phone_number}",
                "user_message": message_text,
                "bot_reply": reply_text,
                "platform": "whatsapp"
            })

    except Exception as e:
        print("Error processing WhatsApp message:", e)

    return {"status": "success"}

# Function to send WhatsApp messages (text or template)
def send_whatsapp_message(to, message):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"

    # You can switch between template and plain text
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": message}  # Plain text message
    }

    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    print("WhatsApp API response:", response.status_code, response.text)

# Chatbot response logic
def chatbot_response(user_message):
    user_message = user_message.lower()
    
    if "website" in user_message:
        return "We provide Website & Web App Development, E-commerce Solutions, and CRM Tools."
    elif "pricing" in user_message:
        return "Website: ₹10,000-₹1,50,000, CRM: ₹20,000-₹70,000, SEO: ₹8,000-₹15,000/month."
    elif "contact" in user_message or "agent" in user_message:
        return "You can reach us at contactus@ninzex.com or +91 87654320298."
    else:
        return "Hello! Welcome to Ninzex Solutions. You can ask about our services, pricing, or book a demo."

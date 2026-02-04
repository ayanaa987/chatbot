from fastapi import APIRouter, Request, HTTPException
import requests

router = APIRouter()

# ⚡ Your WhatsApp credentials
WHATSAPP_TOKEN = "EAA4ZBhlNf5mcBQhx3EBVygQYT3NSYIHk26GUJ2kTAen8bG1ZBdSybcgo4TtpE1JU4fsNPs2MJy1cQZA6SHYMC1XImTPQkxWTLpu4PUUpqAFCCi9pebWmGXxZCRv0UZCvSpjxTnW8ZCcoDZA2vblhYysbJvYyZAjBvWcDxMGYxdloTN0LgAADwTjS8bumnVrgOJ1qgPhDbmKfq06Yc21wB8QodT38ShUUtmK3oSMGBGsiz2KdZBODw8upkxwbe5MRjtHYUYZAuY8FpaSri7gWSZB7c8n"
PHONE_NUMBER_ID = "1055948144261177"
VERIFY_TOKEN = "mysecret123"

# ---------------- Webhook verification ----------------
@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = None, hub_challenge: str = None, hub_verify_token: str = None
):
    if hub_verify_token == VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Invalid verification token")

# ---------------- Webhook receiver ----------------
@router.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    try:
        entry = data['entry'][0]
        changes = entry['changes'][0]
        value = changes['value']

        if 'messages' in value:
            message_data = value['messages'][0]
            phone_number = message_data['from']
            message_text = message_data['text']['body']

            # Chatbot response
            bot_reply = get_bot_response(message_text)

            # Send reply back to WhatsApp
            send_whatsapp_message(phone_number, bot_reply)

    except Exception as e:
        print("Error:", e)
    return {"status": "success"}

# ---------------- Send WhatsApp messages ----------------
def send_whatsapp_message(to, message):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": message}
    }
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    requests.post(url, json=payload, headers=headers)

# ---------------- Chatbot logic ----------------
def get_bot_response(user_message):
    text = user_message.lower()
    if "website" in text:
        return "We provide Website & Web App Development, E-commerce Solutions, and CRM Tools."
    elif "pricing" in text:
        return "Website: ₹10,000-₹1,50,000, CRM: ₹20,000-₹70,000, SEO: ₹8,000-₹15,000/month."
    elif "contact" in text or "agent" in text:
        return "You can reach us at contactus@ninzex.com or +91 87654320298."
    else:
        return "Hello! Welcome to Ninzex Solutions. You can ask about our services, pricing, or book a demo."

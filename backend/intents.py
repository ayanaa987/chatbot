def detect_intent(message: str):
    msg = message.lower().strip()

    # Company info
    if "company info" in msg or "company" in msg or "about" in msg:
        return "company_info"

    # Services
    if msg == "services" or "services" in msg:
        return "services"

    # Pricing
    if msg == "pricing" or "price" in msg or "cost" in msg:
        return "pricing"

    # AI Support
    if "ai support" in msg or "ai" in msg or "chatbot" in msg:
        return "ai_support"

    # Website Development
    if "website development" in msg or "website" in msg or "web" in msg:
        return "website_development"

    # Digital Marketing
    if "digital marketing" in msg or "seo" in msg or "marketing" in msg:
        return "digital_marketing"

    # CRM / Management Tools
    if "crm management tools" in msg or "crm" in msg or "management tools" in msg:
        return "crm_tools"

    # Hardware Support
    if "hardware support" in msg or "hardware" in msg or "repair" in msg:
        return "hardware_support"

    # Contact
    if msg == "contact" or "contact" in msg or "address" in msg:
        return "contact"

    return "fallback"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat_routes import router as chat_router
from routes.admin_routes import router as admin_router
from routes.demo_routes import router as demo_router
from routes.whatsapp_routes import router as whatsapp_router


app = FastAPI(title="Ninzex Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(whatsapp_router, prefix="/whatsapp", tags=["WhatsApp"])

@app.get("/health")
def health():
    return {"status": "ok"}

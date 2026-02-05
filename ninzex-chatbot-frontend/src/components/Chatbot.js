import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FiSend,
  FiPaperclip,
  FiRefreshCcw,
  FiMinus,
  FiX,
  FiMessageCircle,
  FiMic,
  FiMicOff,
} from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import "./Chatbot.css";
const API_URL = import.meta.env.VITE_API_URL;
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const [sessionId, setSessionId] = useState(
    localStorage.getItem("sessionId") || Date.now().toString(),
  );

  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || [],
  );

  const [input, setInput] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    if (messages.length === 0) resetChat();
  }, []);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ================= SAVE CHAT ================= */
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    localStorage.setItem("sessionId", sessionId);
  }, [messages, sessionId]);

  /* ================= VOICE INPUT ================= */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ================= RESET ================= */
  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hello! Welcome to Ninzex Solutions.\nHow can I assist you today?",
        options: [
          "Company Info",
          "Services",
          "Pricing",
          "Website Development",
          "Digital Marketing",
          "Hardware Support",
          "AI Support",
          "Cloud Services",
          "Talk to Agent",
        ],
      },
    ]);
  };

  useEffect(() => {
    if (messages.length === 0) {
      resetChat();
    }
  }, [messages.length, resetChat]);

  /* ================= SEND ================= */
  const sendMessage = async (customMsg) => {
    const msg = customMsg || input;
    if (!msg) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: msg, time: timeNow() },
    ]);

    setInput("");
    setTyping(true);

    try {
      const res = await axios.post(`${API_URL}/chat/`, {
  session_id: sessionId,
  message: msg,
});

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
          options: res.data.options || [],
          time: timeNow(),
        },
      ]);
    } catch {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Server is not reachable. Please try again later.",
          time: timeNow(),
        },
      ]);
    }
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📎 ${file.name}`, time: timeNow() },
      {
        sender: "bot",
        text: "📄 File received. Our team will review it.",
        time: timeNow(),
      },
    ]);
  };

  /* ================= UI ================= */
  if (!isOpen) {
    return (
      <button className="chat-launcher" onClick={() => setIsOpen(true)}>
        <FiMessageCircle size={22} />
        <span>Chat</span>
      </button>
    );
  }

  return (
    <div className={`chat-widget ${minimized ? "minimized" : ""}`}>
      {/* ===== HEADER ===== */}
      <div className="chat-header">
        <div className="header-left">
          <div className="bot-avatar">
            <BsRobot />
          </div>
          <div>
            <h4>Ninzex Assistant</h4>
            <span className="status">Online</span>
          </div>
        </div>

        <div className="header-actions">
          <FiMinus onClick={() => setMinimized(!minimized)} />
          <FiRefreshCcw onClick={resetChat} />
          <FiX onClick={() => setIsOpen(false)} />
        </div>
      </div>

      {!minimized && (
        <>
          {/* ===== BODY ===== */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                <div className="bubble">
                  {msg.text.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}

                  <span className="time">{msg.time}</span>

                  {msg.options && msg.options.length > 0 && (
                    <div className="options">
                      {msg.options.map((opt, idx) => (
                        <button key={idx} onClick={() => sendMessage(opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="msg bot">
                <div className="bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ===== INPUT ===== */}
          <div className="chat-input">
            <button onClick={() => fileInputRef.current.click()}>
              <FiPaperclip />
            </button>

            <button
              className={`mic-btn ${listening ? "active" : ""}`}
              onClick={toggleVoiceInput}
            >
              {listening ? <FiMicOff /> : <FiMic />}
            </button>

            <input
              value={input}
              placeholder={listening ? "Listening..." : "Type your message..."}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button className="send" onClick={() => sendMessage()}>
              <FiSend />
            </button>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;


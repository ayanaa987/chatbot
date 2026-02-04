import React, { useState } from "react";
import Chatbot from "../components/Chatbot";
import "./HomePage.css";
import { FaRobot } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import {
  Bot,
  Send,
  CreditCard,
  MessageSquare,
  Clock,
  Rocket,
  ShieldCheck,
  BarChart,
  Cpu,
  Globe,
} from "lucide-react";
const trackFAQ = (question) => {
  console.log("FAQ Clicked:", question);

  // Example: send to backend later
  // fetch("/api/faq-click", {
  //   method: "POST",
  //   body: JSON.stringify({ question }),
  // });
};

const features = [
  {
    icon: <Bot size={28} color="#0ea5e9" />,
    title: "Smart Learning AI",
    desc: "Continuously improves responses using real-time conversations.",
  },
  {
    icon: <Send size={28} color="#38bdf8" />,
    title: "Lightning Fast Replies",
    desc: "Instant AI responses with ultra-low latency.",
  },
  {
    icon: <ShieldCheck size={28} color="#22d3ee" />,
    title: "Enterprise-Grade Security",
    desc: "End-to-end encryption & secure infrastructure.",
  },
  {
    icon: <MessageSquare size={28} color="#0ea5e9" />,
    title: "Multilingual Support",
    desc: "Communicate in 100+ languages with contextual accuracy.",
  },
  {
    icon: <BarChart size={28} color="#38bdf8" />,
    title: "Advanced Analytics",
    desc: "Track engagement, sentiment & performance insights.",
  },
  {
    icon: <Clock size={28} color="#22d3ee" />,
    title: "24/7 AI Availability",
    desc: "Never miss customer queries — AI works nonstop.",
  },
  {
    icon: <Cpu size={28} color="#0ea5e9" />,
    title: "AI Automation",
    desc: "Automate workflows, FAQs & lead qualification.",
  },
  {
    icon: <Globe size={28} color="#38bdf8" />,
    title: "Global Scalability",
    desc: "Scale to millions of conversations effortlessly.",
  },
  {
    icon: <Rocket size={28} color="#22d3ee" />,
    title: "Rapid Deployment",
    desc: "Integrate chatbot into your system within minutes.",
  },
];

const HomePage = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="logo">
          <FaRobot className="logo-icon" />
          <span>AI Chatbot</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>

          <a href="http://localhost:3000/admin" className="admin-login">
            Login
          </a>

          <button className="primary-btn" onClick={() => setShowChat(true)}>
            Get Started
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-left">
          <span className="badge">Powered by Advanced AI</span>

          <h1>
            An <span className="gradient-text">AI Chatbot for Businesses</span>{" "}
            that Sells, Supports & Converts, around the clock!
          </h1>

          <p>
            Tired of missed leads due to slow responses? ItsBot Chat Agent is
            your 24/7 assistant trained to convert, support, and qualify, all
            while sounding like part of your team.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setShowChat(true)}>
              Get Early Access
            </button>
            <button className="secondary-btn">Book a Personalized Demo</button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="/images/chatbot-hero.png"
            alt="AI Chatbot"
            className="hero-image"
          />
        </div>
      </section>
      {/* ================= FEATURES ================= */}
      <section className="features" id="features">
        <h2>Powerful Features for Modern Businesses</h2>
        <p className="section-subtitle">
          Everything you need to deliver exceptional AI-powered conversations.
        </p>

        <div className="feature-marquee">
          <div className="feature-track">
            {features.map((item, index) => (
              <div
                className={`feature-card ${index % 2 === 0 ? "move-left" : "move-right"}`}
                key={index}
              >
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTEGRATION HIGHLIGHT ================= */}
      <section className="integration-highlight">
        <h2 className="integration-title">Supercharge your chatbot</h2>

        <p className="integration-subtitle">
          Direct integrations with your favorite tools
        </p>

        <p className="integration-description">
          With native integrations into platforms like <strong>Crisp</strong>,{" "}
          <strong>Intercom</strong>, and <strong>Zendesk</strong>, our chatbot
          becomes an extended arm of your existing toolkit, syncing
          conversations, support, and customer data effortlessly.
        </p>

        <div className="integration-image">
          <img
            src="/images/integration-center.png"
            alt="Chatbot Integrations"
          />
        </div>
      </section>

      <section className="pricing" id="pricing">
        <h2>Pricing</h2>
        <p className="section-subtitle">Simple plans. No hidden charges.</p>

        <div className="pricing-grid">
          {/* STARTER */}
          <div className="price-card accent-orange">
            <h3>Starter</h3>

            <div className="price">
              <span className="amount">$29</span>
              <span className="duration">/mo</span>
            </div>

            <ul>
              <li>1,000 conversations</li>
              <li>Basic AI responses</li>
              <li>Email support</li>
              <li>1 chat agent</li>
            </ul>

            <button className="secondary-btn">Start Trial</button>
          </div>

          {/* PROFESSIONAL */}
          <div className="price-card accent-green">
            <h3>Professional</h3>

            <div className="price">
              <span className="amount">$99</span>
              <span className="duration">/mo</span>
            </div>

            <ul>
              <li>10,000 conversations</li>
              <li>Advanced AI</li>
              <li>Priority support</li>
              <li>5 chat agents</li>
            </ul>

            <button className="primary-btn">Start Trial</button>
          </div>

          {/* ENTERPRISE */}
          <div className="price-card accent-blue">
            <h3>Enterprise</h3>

            <div className="price custom">Custom</div>

            <ul>
              <li>Unlimited conversations</li>
              <li>Custom AI models</li>
              <li>24/7 support</li>
              <li>Enterprise security</li>
            </ul>

            <button className="secondary-btn">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Everything you need to know before getting started
        </p>

        <div className="faq-grid">
          {/* LEFT COLUMN */}
          <div className="faq-column">
            <details
              className="faq-item"
              open
              onToggle={() => trackFAQ("Setup")}
            >
              <summary>Is the chatbot easy to set up?</summary>
              <p>
                Yes. You can connect your data, customize responses, and deploy
                the chatbot in under 10 minutes without any coding.
              </p>
            </details>

            <details
              className="faq-item"
              onToggle={() => trackFAQ("Languages")}
            >
              <summary>Does it support multiple languages?</summary>
              <p>
                Absolutely. Our AI supports 100+ languages with context-aware
                and localized responses.
              </p>
            </details>

            <details
              className="faq-item"
              onToggle={() => trackFAQ("Integrations")}
            >
              <summary>Can I integrate it with my existing tools?</summary>
              <p>
                Yes. Native integrations with CRMs, email tools, Intercom,
                Zendesk, Slack, and more are available.
              </p>
            </details>

            <details className="faq-item" onToggle={() => trackFAQ("Security")}>
              <summary>Is my data secure?</summary>
              <p>
                We use enterprise-grade encryption, secure APIs, and are fully
                GDPR compliant.
              </p>
            </details>

            <details
              className="faq-item"
              onToggle={() => trackFAQ("Customization")}
            >
              <summary>Can I customize the chatbot’s behavior?</summary>
              <p>
                Yes. You can control tone, workflows, fallback rules, and AI
                behavior from the admin dashboard.
              </p>
            </details>
          </div>

          {/* RIGHT COLUMN */}
          <div className="faq-column">
            <details
              className="faq-item"
              onToggle={() => trackFAQ("HumanHandoff")}
            >
              <summary>Can a human agent take over the chat?</summary>
              <p>
                Yes. Seamless human handoff allows agents to jump in instantly
                when needed.
              </p>
            </details>

            <details
              className="faq-item"
              onToggle={() => trackFAQ("Analytics")}
            >
              <summary>Do I get chat analytics and reports?</summary>
              <p>
                Yes. You get real-time analytics, conversation history, and
                performance insights.
              </p>
            </details>

            <details className="faq-item" onToggle={() => trackFAQ("Leads")}>
              <summary>Can the chatbot capture leads?</summary>
              <p>
                Absolutely. It can collect names, emails, phone numbers, and
                sync them directly to your CRM.
              </p>
            </details>

            <details className="faq-item" onToggle={() => trackFAQ("Pricing")}>
              <summary>Is there a free trial available?</summary>
              <p>
                Yes. You can start with a free trial and upgrade anytime as your
                needs grow.
              </p>
            </details>

            <details className="faq-item" onToggle={() => trackFAQ("Support")}>
              <summary>What kind of support do you offer?</summary>
              <p>
                We provide email, chat, and priority support depending on your
                plan, including onboarding assistance.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ================= PRICING IMAGE HIGHLIGHT ================= */}
      <section className="pricing-image-section">
        <div className="pricing-image-wrapper">
          <img
            src="/images/chatbot-dashboard-preview.png"
            alt="AI Chatbot Dashboard Preview"
          />
        </div>
      </section>

      {/* ================= FLOATING CHAT ICON ================= */}
      <button
        className="floating-chat-icon"
        onClick={() => setShowChat(true)}
        title="Chat with us"
      >
        <MessageCircle size={26} />
      </button>

      {/* ================= CHATBOT MODAL ================= */}
      {showChat && (
        <div className="chatbot-overlay">
          <div className="chatbot-box">
            <div className="chatbot-top">
              <span>AI Assistant</span>
              <button onClick={() => setShowChat(false)}>✖</button>
            </div>
            <Chatbot />
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer-premium">
        {/* Main Footer Content */}
        <div className="footer-container">
          {/* Left Side: Brand + Links */}
          <div className="footer-left">
            <div className="footer-brand">
              <h3>ItsBot AI</h3>
              <p>
                AI-powered chatbots built to automate support, capture leads,
                and convert visitors into customers 24/7.
              </p>
            </div>

            <div className="footer-links">
              <div>
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
                <a href="#">Integrations</a>
              </div>

              <div>
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
              </div>

              <div>
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">GDPR</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Card */}
          <div className="footer-right">
            <h4>Get in Touch</h4>
            <p>📧 contactus@ninzex.com</p>
            <p>
              🏢 Office no - 12, Prospect Chamber Annexe,
              <br /> Pitha Street, Fort, Mumbai - 400001
            </p>
            <div className="footer-social">
              <a
                href="https://www.linkedin.com/company/ninzexsolution"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn @ninzexsolution
              </a>
            </div>
            <button className="footer-btn">Start Free Trial</button>
          </div>
        </div>

        {/* Wave at bottom */}
        <svg
          className="footer-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,42.7C840,43,960,53,1080,69.3C1200,85,1320,107,1380,117.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </footer>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ItsBot AI. All rights reserved.</p>
      </div>
    </>
  );
};

export default HomePage;

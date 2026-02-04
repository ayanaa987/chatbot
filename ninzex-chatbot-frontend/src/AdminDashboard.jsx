import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRobot, FaUserTie } from "react-icons/fa";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [chats, setChats] = useState([]);
  const [leads, setLeads] = useState([]);
  const [chatPage, setChatPage] = useState(1);
  const [leadPage, setLeadPage] = useState(1);
  const [search, setSearch] = useState("");
  const [agentSessions, setAgentSessions] = useState({});

  /* ---------- BACKEND (UNCHANGED) ---------- */
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/admin/chats").then((res) => {
      setChats(res.data);
    });

    axios.get("http://127.0.0.1:8000/admin/leads").then((res) => {
      setLeads(res.data);
    });
  }, []);

  /* ---------- GROUP & SEARCH ---------- */
  const groupedChats = chats.reduce((acc, chat) => {
    const match =
      chat.user_message?.toLowerCase().includes(search.toLowerCase()) ||
      chat.bot_reply?.toLowerCase().includes(search.toLowerCase()) ||
      chat.session_id.includes(search);

    if (!search || match) {
      acc[chat.session_id] = acc[chat.session_id] || [];
      acc[chat.session_id].push(chat);
    }
    return acc;
  }, {});

  const sessionIds = Object.keys(groupedChats);
  const paginatedSessions = sessionIds.slice(
    (chatPage - 1) * ITEMS_PER_PAGE,
    chatPage * ITEMS_PER_PAGE,
  );

  /* ---------- LIVE AGENT ---------- */
  const toggleAgent = (sid) => {
    setAgentSessions((prev) => ({
      ...prev,
      [sid]: !prev[sid],
    }));
  };

  /* ---------- CSV EXPORT ---------- */
  const exportCSV = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Requirement\n" +
      leads.map((l) => `${l.name},${l.email},${l.requirement}`).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "leads.csv";
    link.click();
  };

  return (
    <>
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.logo}>
          <FaRobot size={22} />
          <span>AI Chatbot Admin</span>
        </div>
        <nav style={styles.navLinks}>
          <a href="/" style={styles.link}>
            Home
          </a>
          <a href="/admin" style={styles.link}>
            Dashboard
          </a>
          <a href="/logout" style={styles.logout}>
            Logout
          </a>
        </nav>
      </header>

      <main style={styles.page}>
        {/* TOP BAR */}
        <div style={styles.topBar}>
          <h1>Admin Dashboard</h1>
          <div style={styles.searchBox}>
            <Search size={18} />
            <input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* KPI */}
        <div style={styles.kpiGrid}>
          <KPI title="Total Chats" value={chats.length} />
          <KPI title="Sessions" value={sessionIds.length} />
          <KPI title="Leads" value={leads.length} />
          <div style={styles.exportCard}>
            <p>Export Leads</p>
            <button onClick={exportCSV}>Download CSV</button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div style={styles.contentGrid}>
          {/* CHAT PANEL */}
          <section style={styles.panel}>
            <h2>💬 Chat Sessions</h2>

            <div style={styles.scrollArea}>
              {paginatedSessions.map((sid) => (
                <div key={sid} style={styles.sessionCard}>
                  <div style={styles.sessionHeader}>
                    <strong>Session: {sid}</strong>
                    <button
                      onClick={() => toggleAgent(sid)}
                      style={{
                        ...styles.agentBtn,
                        background: agentSessions[sid] ? "#16a34a" : "#2563eb",
                      }}
                    >
                      <FaUserTie />
                      {agentSessions[sid] ? "Human Active" : "Take Over"}
                    </button>
                  </div>

                  {groupedChats[sid].map((c, i) => (
                    <div key={i}>
                      <div style={styles.userMsg}>👤 {c.user_message}</div>
                      <div style={styles.botMsg}>🤖 {c.bot_reply}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <Pagination
              page={chatPage}
              total={Math.ceil(sessionIds.length / ITEMS_PER_PAGE)}
              setPage={setChatPage}
            />
          </section>

          {/* LEADS PANEL */}
          <section style={styles.panel}>
            <h2>📋 Leads</h2>

            <div style={styles.scrollArea}>
              {leads
                .slice(
                  (leadPage - 1) * ITEMS_PER_PAGE,
                  leadPage * ITEMS_PER_PAGE,
                )
                .map((l, i) => (
                  <div key={i} style={styles.leadCard}>
                    <strong>{l.name}</strong>
                    <p>{l.email}</p>
                    <small>{l.requirement}</small>
                  </div>
                ))}
            </div>

            <Pagination
              page={leadPage}
              total={Math.ceil(leads.length / ITEMS_PER_PAGE)}
              setPage={setLeadPage}
            />
          </section>
        </div>
      </main>
    </>
  );
};

/* ---------- COMPONENTS ---------- */

const KPI = ({ title, value }) => (
  <div style={styles.kpi}>
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

const Pagination = ({ page, total, setPage }) => (
  <div style={styles.pagination}>
    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
      Prev
    </button>
    <span>
      {page} / {total}
    </span>
    <button disabled={page === total} onClick={() => setPage(page + 1)}>
      Next
    </button>
  </div>
);

/* ---------- STYLES : ENTERPRISE PREMIUM + REAL ICONS ---------- */

const styles = {
  /* ===== HEADER ===== */
  navbar: {
    height: 72,
    background: "#ffffff",
    color: "#0f172a",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 32px",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    borderBottom: "1px solid rgba(226,232,240,0.9)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 18,
    fontWeight: 700,
    color: "rgb(13 36 156);",
  },

  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  navLinks: {
    display: "flex",
    gap: 26,
    alignItems: "center",
  },

  link: {
    color: "#475569",
    textDecoration: "none",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  logout: {
    color: "#2563eb",
    fontWeight: 600,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  /* ===== PAGE ===== */
  page: {
    padding: 32,
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2ff 40%, #f8fafc 100%)",
    minHeight: "100vh",
  },

  /* ===== TOP BAR ===== */
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 16,
  },

  /* ===== SEARCH ===== */
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#ffffff",
    padding: "10px 16px",
    borderRadius: 999,
    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
    border: "1px solid rgba(226,232,240,0.9)",
  },

  searchIcon: {
    color: "#64748b",
  },

  /* ===== KPI ===== */
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },

  kpi: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(14px)",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 25px 50px rgba(15,23,42,0.12)",
    border: "1px solid rgba(226,232,240,0.9)",
    display: "flex",
    gap: 16,
    alignItems: "center",
  },

  kpiIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563eb",
    fontSize: 20,
  },

  kpiText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  exportCard: {
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    borderRadius: 20,
    padding: 24,
  },

  /* ===== MAIN GRID ===== */
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "2.4fr 1fr",
    gap: 24,
  },

  /* ===== PANELS ===== */
  panel: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(18px)",
    padding: 24,
    borderRadius: 22,
    display: "flex",
    flexDirection: "column",
    minHeight: 560,
    boxShadow: "0 35px 70px rgba(15,23,42,0.14)",
    border: "1px solid rgba(226,232,240,0.9)",
  },

  panelTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 600,
  },

  panelIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0f172a",
  },

  scrollArea: {
    flex: 1,
    overflowY: "auto",
    marginTop: 16,
    paddingRight: 6,
  },

  /* ===== CHAT SESSION CARD ===== */
  sessionCard: {
    background: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    boxShadow: "0 16px 35px rgba(15,23,42,0.12)",
    border: "1px solid rgba(226,232,240,0.9)",
  },

  sessionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  agentBtn: {
    color: "#ffffff",
    border: "none",
    borderRadius: 999,
    padding: "8px 16px",
    display: "flex",
    gap: 8,
    cursor: "pointer",
    alignItems: "center",
    fontWeight: 600,
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
  },

  /* ===== MESSAGES ===== */
  userMsg: {
    background: "#eef2ff",
    padding: 12,
    borderRadius: 14,
    marginTop: 8,
    fontSize: 14,
  },

  botMsg: {
    background: "#ecfeff",
    padding: 12,
    borderRadius: 14,
    marginTop: 6,
    fontSize: 14,
  },

  /* ===== LEADS ===== */
  leadCard: {
    background: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    boxShadow: "0 16px 35px rgba(15,23,42,0.12)",
    border: "1px solid rgba(226,232,240,0.9)",
  },

  /* ===== PAGINATION ===== */
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 18,
  },
};

export default AdminDashboard;

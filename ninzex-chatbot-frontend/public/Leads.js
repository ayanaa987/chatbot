import React, { useState, useEffect } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadPage, setLeadPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/admin/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.requirement?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const totalLeadPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);

  const paginatedLeads = filteredLeads.slice(
    (leadPage - 1) * ITEMS_PER_PAGE,
    leadPage * ITEMS_PER_PAGE
  );

  const exportCSV = () => {
    const headers = ["Name", "Email", "Requirement"];
    const rows = leads.map((l) => [l.name, l.email, l.requirement]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "leads.csv";
    link.click();
  };

  return (
    <div style={styles.section}>
      <h2>📋 Leads</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: 15 }}>
        <input
          style={styles.search}
          placeholder="Search leads..."
          value={leadSearch}
          onChange={(e) => setLeadSearch(e.target.value)}
        />
        <button style={styles.exportBtn} onClick={exportCSV}>
          📤 Export CSV
        </button>
      </div>

      {paginatedLeads.length === 0 ? (
        <p style={styles.empty}>No leads found</p>
      ) : (
        <div style={styles.grid}>
          {paginatedLeads.map((l, i) => (
            <div key={i} style={styles.card}>
              <p>
                <b>Name:</b> {l.name}
              </p>
              <p>
                <b>Email:</b> {l.email}
              </p>
              <p>
                <b>Requirement:</b> {l.requirement}
              </p>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={leadPage}
        total={totalLeadPages}
        setPage={setLeadPage}
      />
    </div>
  );
};

/* ---------------- Pagination Component ---------------- */
const Pagination = ({ page, total, setPage }) => (
  <div style={styles.pagination}>
    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
      Prev
    </button>
    <span>
      Page {page} of {total}
    </span>
    <button disabled={page === total} onClick={() => setPage(page + 1)}>
      Next
    </button>
  </div>
);

/* ---------------- Styles ---------------- */
const styles = {
  section: { marginBottom: 40 },
  search: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    width: 220,
  },
  exportBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  empty: { color: "#6b7280", fontStyle: "italic" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  pagination: { display: "flex", gap: 10, alignItems: "center", marginTop: 10 },
};

export default Leads;

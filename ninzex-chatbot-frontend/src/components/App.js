import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chatbot from "./components/Chatbot";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Homepage */}
        <Route path="/chat" element={<Chatbot />} /> {/* Chatbot */}
        <Route path="/admin" element={<AdminDashboard />} />{" "}
        {/* Admin Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;

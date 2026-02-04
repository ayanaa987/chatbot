import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import LaptopRepair from "./pages/LaptopRepair";
import OfficeITSetup from "./pages/OfficeITSetup";
import Contact from "./pages/Contact";
import Chatbot from "./components/Chatbot";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Website Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/laptop-repair" element={<LaptopRepair />} />
        <Route path="/office-it-setup" element={<OfficeITSetup />} />
        <Route path="/contact" element={<Contact />} />

        {/* Chatbot */}
        <Route path="/chat" element={<Chatbot />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

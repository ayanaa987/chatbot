const Services = () => {
  const services = [
    "Website Development",
    "Digital Marketing",
    "Hardware Support",
    "AI Support",
    "CRM / Management Tools",
  ];

  return (
    <div className="services-page">
      <h2>Our Services</h2>

      <div className="service-grid">
        {services.map((s, i) => (
          <div key={i} className="service-card">
            <h3>{s}</h3>
            <button>Ask Chatbot</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

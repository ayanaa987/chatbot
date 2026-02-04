import React from "react";

const Options = ({ options, onClick }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="options-container">
      {options.map((opt, idx) => (
        <button key={idx} className="option-btn" onClick={() => onClick(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
};

export default Options;

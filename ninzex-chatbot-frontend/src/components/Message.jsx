import React from "react";

const Message = ({ text, sender }) => {
  return (
    <div className={`message ${sender === "user" ? "user-msg" : "bot-msg"}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;

import { useState, useEffect, useRef } from "react";
import './App.css';
import ReactMarkdown from 'react-markdown';
// const dotenv = require("dotenv");

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🙏 Welcome to DivineAI. \n I'm here to help guide you through your questions about faith, spirituality, and religion — no matter where you're coming from or what you're searching for. Whether you're looking for comfort, clarity, scripture, or simply a space to reflect, you're not alone. \n Ask me anything!" },
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // const ipAddress = process.env.REACT_APP_IP_ADDRESS + "/chat";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSummary = async (userMessage) => {
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);

    try {
      const response = await fetch("https://divineai.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "No response received." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    getSummary(input);
    setInput("");
  };

  return (
    <div className="homeArea">
      <h1 className="title-container">DivineAI</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <div className="message">
            <strong>{msg.role === "user" ? "You" : "DivineAI"}:</strong>
            <div className="markdown"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </div>
        </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Form at the bottom */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
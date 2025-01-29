import React, { useState } from "react";
import { OpenAI } from "openai";

const HomeChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true, 
  });

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          ...messages.map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
          { role: "user", content: userInput }
        ],
      });

      const botReply = response.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong. Try again later." }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2>Chat with ChatGPT</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", color: msg.sender === "user" ? "blue" : "black" }}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{ width: "80%", padding: "8px" }}
        />
        <button onClick={handleSendMessage} disabled={loading} style={{ marginLeft: "10px", padding: "8px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default HomeChat;

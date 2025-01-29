import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";
import { useAuth } from "../../../context/AuthContext";

const HomeChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  
  // OpenAI API Setup
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // API Key from .env
    dangerouslyAllowBrowser: true, // Required for frontend usage
  });

  useEffect(() => {
    if (questionCount === 0) {
      askNextQuestion();
    }
  }, []);

  const askNextQuestion = async () => {
    if (questionCount >= 5) return;

    const questions = [
      "What are your biggest passions in life?",
      "How do you usually spend your free time?",
      "What qualities do you value most in a friend?",
      "What is a dream or goal you are currently working towards?",
      "If you could have a deep conversation with anyone, who would it be and why?"
    ];

    const botMessage = { sender: "bot", text: questions[questionCount] };
    setMessages((prev) => [...prev, botMessage]);
    setQuestionCount(questionCount + 1);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an AI that helps users discover themselves by asking meaningful questions." },
          ...messages.map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
          { role: "user", content: userInput }
        ],
      });

      const botReply = response.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

      if (questionCount < 5) {
        setTimeout(askNextQuestion, 2000);
      }
    } catch (error) {
      console.error("Error with OpenAI API:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2>Chat with DeepFriends AI</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", color: msg.sender === "user" ? "blue" : "black" }}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      {questionCount < 5 && (
        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response..."
            disabled={loading}
            style={{ width: "80%", padding: "8px" }}
          />
          <button onClick={handleSendMessage} disabled={loading} style={{ marginLeft: "10px", padding: "8px" }}>
            Send
          </button>
        </div>
      )}
      {questionCount >= 5 && <p>✅ You’ve completed the chat! Thank you!</p>}
    </div>
  );
};

export default HomeChat;

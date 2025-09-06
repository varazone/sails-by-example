import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
    { id: 2, text: "I'm looking for information about this dApp", sender: "user" },
    { id: 3, text: "This is a scaffold-sails application with counter functionality and DNS features. What would you like to know?", sender: "ai" }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: "user"
      };
      setMessages([...messages, newMessage]);
      setInputText("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I'm a mock AI assistant. In a real implementation, I would process your message and provide helpful responses.",
          sender: "ai"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chat Assistant</h1>
      
      <div className="flex-1 overflow-y-auto mb-6 bg-base-200 rounded-lg p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-lg lg:max-w-2xl px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-100 text-base-content"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 input input-bordered input-lg"
        />
        <button
          onClick={handleSendMessage}
          className="btn btn-primary btn-lg"
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
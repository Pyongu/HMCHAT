import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? 😊", sender: "bot" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Handle message send
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
      // Simulate bot response after user message
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "lil tjay",
          sender: "HMC ChatBot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center py-6">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full mt-20">
        <div className="p-4 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-gold-600 text-black"
                      : "bg-gray-300 text-black"
                  } p-3 rounded-lg max-w-xs break-words`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Ask HMC Chatbot a question!"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-gold-600 text-black rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

import React, { useState} from "react";
import { useOnKeyPress } from "../keyPress";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? 😊", sender: "bot" },
  ]);

  const [query, setQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const websocket = new WebSocket("ws://localhost:8000/ws/stream");
    setIsStreaming(true);

    const botMessageId = messages.length + 2;
    let botText = "";

    // Add empty placeholder bot message
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: "", sender: "HMC ChatBot" },
    ]);

    setNewMessage("");
    setQuery("");

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
      websocket.send(JSON.stringify({ query }));
    };

    websocket.onmessage = (event) => {
      const data = event.data;

      if (data === "<<END>>") {
        websocket.close();
        setIsStreaming(false);
        return;
      }

      if (data === "<<E:NO_QUERY>>") {
        console.log("ERROR: No Query, closing connection...");
        websocket.close();
        setIsStreaming(false);
        return;
      }

      botText += data;

      // Update last bot message

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: botText } : msg
        )
      );
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      websocket.close();
      setIsStreaming(false);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsStreaming(false);
    };
  };

  useOnKeyPress(handleSendMessage, 'Enter');

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
                  {message.text || (
                    <span className="italic text-gray-500">Typing...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Ask HMC Chatbot a question!"
            />
            <button
              onClick={handleSendMessage}
              disabled={isStreaming}
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
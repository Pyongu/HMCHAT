import React, { useState } from "react";


const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? 😊", sender: "bot" },
  ]);

  const [query, setQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

//   Handle change in the user query textarea 
//   Implement this later, I think we are using a old verison of React?
const handleQueryChange = (event) => {
  setQuery(event.target.value);
};

  // Handle message send
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; 

    // Open Websocket Instance
    const websocket = new WebSocket('ws://localhost:8000/ws/stream');
    setIsStreaming(true);
    setNewMessage("");

    // Websocket On Open Action
    websocket.onopen = () => {
      console.log('WebSocket connection opened.');
      // Send query to the server
      websocket.send(JSON.stringify({ query }));
    };

    // ON MESSAGE HANDLER
    websocket.onmessage = (event) => {
    const data = event.data;
    console.log('data: ', data);

    // Check for the termination flag
    if (data === '<<END>>') {
      websocket.close();
      setIsStreaming(false);
      return;
    }
    // Check for no query Error flag
    if (data === '<<E:NO_QUERY>>') {
      console.log('ERROR: No Query, closing connection...')
      websocket.close();
      setIsStreaming(false);
      return;
    }

    const newMessageObj = {
      id: messages.length + 1,
      text: query,
      sender: "user",
    };
    setMessages([...messages, newMessageObj]);
    setNewMessage("");
    // Simulate bot response after user message
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: data,
        sender: "HMC ChatBot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);

    // Websocket Error Handler
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      websocket.close();
      setIsStreaming(false);
    };

    // ON CLOSE Action
    websocket.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsStreaming(false);
    };
  };
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
              value={query}
              // Change to use queryChange later
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

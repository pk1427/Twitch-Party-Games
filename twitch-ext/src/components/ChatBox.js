import { useState, useEffect } from "react";
import WebSocketService from "../services/WebSocketService";

function Chatbox() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Start WebSocket connection
    WebSocketService.connect();

    // Attach WebSocket listener
    const handleMessage = (data) => {
      if (data.type === "chatbox") {
        setChatHistory((prev) => [...prev, `${data.player}: ${data.message}`]);
      }
    };

    WebSocketService.listenToChatbox(handleMessage);

    return () => {
      WebSocketService.removeChatboxListener(handleMessage);
      WebSocketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      WebSocketService.sendMessage(message, true); // true for chatbox message
      setMessage(""); // Clear input
    }
  };

  return (
    <div>
      <div className="chatbox">
        {chatHistory.map((chat, index) => (
          <div key={index}>{chat}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbox;

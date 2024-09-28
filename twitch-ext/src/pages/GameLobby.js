import React, { useState, useEffect } from "react";
import WebSocketService from "../services/WebSocketService";
import Header from "../components/Header";
import MainArea from "../components/MainArea"; // Import MainArea component for game cards and streamer controls
// import ChatBox from "../components/ChatBox";
import './GameLobby.css';

const GameLobby = () => {
  const [message, setMessage] = useState("");

  // WebSocket connection setup
  useEffect(() => {
    WebSocketService.connect(); // Establish WebSocket connection on mount

    return () => {
      WebSocketService.disconnect(); // Disconnect WebSocket on unmount
    };
  }, []);

  // Handle message sending via WebSocket
  const handleSendMessage = () => {
    if (message.trim()) {
      WebSocketService.sendMessage(message);
      setMessage(""); // Clear message after sending
    }
  };

  return (
    <div className="game-lobby-container">
      {/* Header section */}
      <Header />

      {/* Main area with game cards and streamer controls */}
      <MainArea />

      {/* Chat message input */}

      {/* <ChatBox/> */}
      <div className="chat-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default GameLobby;

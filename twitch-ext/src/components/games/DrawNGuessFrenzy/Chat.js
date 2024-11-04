// Chat.js
import React, { useState, useEffect } from "react";
import "./DrawNGuessFrenzy.css";

function Chat({ socket, roomId }) {
  const [guess, setGuess] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("guess", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.guess]);
    });

    return () => {
      socket.off("guess");
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() !== "") {
      socket.emit("guess", roomId, guess);
      setGuess("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat & Guesses</div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            {msg}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;

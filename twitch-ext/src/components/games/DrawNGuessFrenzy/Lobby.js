// Lobby.js
import React, { useState } from "react";
import "./DrawNGuessFrenzy.css";

function Lobby({ socket, setRoomId }) {
  const [inputRoomId, setInputRoomId] = useState("");

  const joinRoom = () => {
    if (inputRoomId.trim() !== "") {
      socket.emit("createRoom", inputRoomId);
      setRoomId(inputRoomId);
    }
  };

  return (
    <div className="lobby">
      <h2>Draw 'N' Guess Frenzy - Lobby</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default Lobby;

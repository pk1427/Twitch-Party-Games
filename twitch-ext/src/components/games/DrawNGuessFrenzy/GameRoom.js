// GameRoom.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Canvas from "./Canvas";
import Chat from "./Chat";
import Lobby from "./Lobby";
import ToolsPanel from "./ToolsPanel";
import "./DrawNGuessFrenzy.css";

// const socket = io("http://https://twitch-party-games.onrender.com");
// const socket = io("http://https://twitch-party-games.onrender.com", { withCredentials: true });
const socket = io("http://https://twitch-party-games.onrender.com"); // Adjust the port here

function GameRoom() {
  const [roomId, setRoomId] = useState(null);
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    socket.on("startRound", (newWord) => {
      setWord(newWord);
    });

    socket.on("receiveHint", (receivedHint) => {
      alert(`Hint: ${receivedHint}`);
    });

    return () => {
      socket.off("startRound");
      socket.off("receiveHint");
    };
  }, []);

  const sendHint = () => {
    if (hint.trim() !== "") {
      socket.emit("hint", roomId, hint);
      setHint("");
    }
  };

  return (
    <div className="game-room">
      <div className="game-room-header">Draw 'N' Guess Frenzy</div>
      <div className="game-room-content">
        {!roomId ? (
          <Lobby socket={socket} setRoomId={setRoomId} />
        ) : (
          <>
            <div className="canvas-container">
              <h3>Draw this: {word}</h3>
              <div className="canvas-wrapper">
                <Canvas socket={socket} roomId={roomId} />
              </div>
              <ToolsPanel />
              <div className="hint-system">
                <input
                  type="text"
                  value={hint}
                  placeholder="Enter hint"
                  onChange={(e) => setHint(e.target.value)}
                />
                <button onClick={sendHint}>Send Hint</button>
              </div>
            </div>
            <Chat socket={socket} roomId={roomId} />
          </>
        )}
      </div>
    </div>
  );
}

export default GameRoom;

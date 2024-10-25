import React from "react";
import './StreamerControls.css';
import webSocketService from '../services/WebSocketService'; // Import the updated WebSocket service

const StreamerControls = () => {
  const handleStartGame = () => {
    const gameId = "game-123"; // Example game ID, replace with real ID
    webSocketService.startGame(gameId); // Trigger the startGame function in WebSocketService
    console.log(`Game with ID ${gameId} started!`);
  };

  const handleManagePlayers = () => {
    const gameId = "game-123"; // Example game ID
    webSocketService.managePlayers(gameId); // Trigger managePlayers in WebSocketService
    console.log(`Managing players for game with ID ${gameId}`);
  };

  const handleKickPlayer = () => {
    const playerId = "player-456"; // Example player ID, replace with actual player ID
    webSocketService.kickPlayer(playerId); // Trigger kickPlayer in WebSocketService
    console.log(`Player with ID ${playerId} kicked!`);
  };

  return (
    <div className="streamer-controls">
      <button className="streamer-controls__btn" onClick={handleStartGame}>
        Start Game
      </button>
      <button className="streamer-controls__btn" onClick={handleManagePlayers}>
        Manage Players
      </button>
      <button className="streamer-controls__btn" onClick={handleKickPlayer}>
        Kick Player
      </button>
    </div>
  );
};

export default StreamerControls;

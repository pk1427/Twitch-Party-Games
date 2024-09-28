import React from "react";

const StreamerControls = () => {
  const handleStartGame = () => {
    console.log("Game started!");
  };

  const handleManagePlayers = () => {
    console.log("Manage players clicked");
  };

  const handleKickPlayer = () => {
    console.log("Kick player clicked");
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

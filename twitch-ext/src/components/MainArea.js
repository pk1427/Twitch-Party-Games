// MainArea.js
import React, { useContext } from "react";
import "./MainArea.css";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import StreamerControls from "./StreamerControls"; // Import Streamer Controls

const GameCard = ({ title, description, playerCount, isStreamer }) => {
  return (
    <div className="game-card">
      <h2 className="game-card__title">{title}</h2>
      <p className="game-card__description">{description}</p>
      {isStreamer ? (
        <StreamerControls /> // Render Streamer Controls if it's the streamer
      ) : (
        <>
          <button className="game-card__join-btn">Join</button> {/* Join button for players */}
          <p className="game-card__player-count">{playerCount} players</p>
        </>
      )}
    </div>
  );
};

const MainArea = () => {
  const { user } = useContext(AuthContext); // Access user from AuthContext

  // Determine if the user is a streamer based on the role
  const isStreamer = user?.role === "streamer"; // Check if the user is a streamer

  return (
    <div className="main-area">
      <GameCard
        title="Trivia"
        description="Answer questions from various topics."
        playerCount={10}
        isStreamer={isStreamer} // Pass the streamer status to GameCard
      />
      <GameCard
        title="Guessing"
        description="Guess the word based on clues."
        playerCount={7}
        isStreamer={isStreamer}
      />
      <GameCard
        title="Drawing"
        description="Draw and let others guess!"
        playerCount={5}
        isStreamer={isStreamer}
      />
    </div>
  );
};

export default MainArea;

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import StreamerControls from './StreamerControls'; // Assuming you have Streamer controls component
// import './GameCard.css';   // Ensure correct path

const GameCard = ({ title, description, playerCount, isStreamer, gameRoute }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleJoinClick = () => {
    navigate(gameRoute); // Navigate to the specific game page (e.g., trivia, guessing, drawing)
  };

  return (
    <div className="game-card">
      <h3 className="game-card__title">{title}</h3>
      <p className="game-card__description">{description}</p>
      
      {isStreamer ? (
        <StreamerControls gameRoute={gameRoute} /> // Render Streamer controls if it's the streamer
      ) : (
        <>
          <button className="game-card__join-btn" onClick={handleJoinClick}>Join</button> {/* Join button for players */}
          <p className="game-card__player-count">Players: {playerCount}</p>
        </>
      )}
    </div>
  );
};

export default GameCard; // Default export GameCard

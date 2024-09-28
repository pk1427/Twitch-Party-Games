import React from 'react';
import './GameCard.css'; // Ensure correct path

const GameCard = ({ title, description, playerCount }) => {
  return (
    <div className="game-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button>Join</button>
      <p>Players: {playerCount}</p>
    </div>
  );
};

export default GameCard; // Default export GameCard

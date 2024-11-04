import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import './StreamersList.css';

const StreamersList = () => {
  const { user } = useContext(AuthContext);
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isStreamer = user?.role === "streamer";

  useEffect(() => {
    // Fetch streamers from the backend
    const fetchStreamers = async () => {
      try {
        const response = await axios.get(''); // Update with the actual backend URL
        setStreamers(response.data);
      } catch (error) {
        console.error('Error fetching streamers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamers();
  }, []);

  // Handlers for GameCard buttons
  const handleStartGame = (gameRoute) => {
    console.log(`Starting game at route: ${gameRoute}`);
    // Add logic to start the game
  };

  const handleManagePlayers = (gameRoute) => {
    console.log(`Managing players for game at route: ${gameRoute}`);
    // Add logic to manage players
  };

  if (loading) {
    return <p>Loading streamers...</p>;
  }

  return (
    <div>
      <h1>Streamers Controls</h1>
      <ul>
        {streamers.map((streamer) => (
          <li key={streamer.id} style={{ fontWeight: streamer.isOnline ? 'bold' : 'normal' }}>
            {streamer.display_name} - {streamer.isOnline ? 'Active' : 'Offline'}
            {streamer.isOnline && (
              <div style={{ marginTop: '8px' }}>
                <button onClick={() => handleStartGame(`/start-stream/${streamer.id}`)}>Start</button>
                <button onClick={() => handleManagePlayers(`/manage-stream/${streamer.id}`)}>Manage Players</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="main-area">
        <GameCard
          title="Trivia"
          description="Answer questions from various topics."
          playerCount={10}
          isStreamer={isStreamer}
          gameRoute="/trivia"
          onStart={handleStartGame}
          onManagePlayers={handleManagePlayers}
        />
        
        <GameCard
          title="Drawing"
          description="Draw and let others guess!"
          playerCount={5}
          isStreamer={isStreamer}
          gameRoute="/draw-guess"
          onStart={handleStartGame}
          onManagePlayers={handleManagePlayers}
        />

        <GameCard
          title="Tic-Tac-Toe"
          description="Play the classic game against others!"
          playerCount={2}
          isStreamer={isStreamer}
          gameRoute="/tic-tac-toe"
          onStart={handleStartGame}
          onManagePlayers={handleManagePlayers}
        />
      </div>
    </div>
  );
};

// GameCard component defined inline
const GameCard = ({ title, description, playerCount, isStreamer, gameRoute, onStart, onManagePlayers }) => {
  return (
    <div className="game-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Player Count: {playerCount}</p>
      {isStreamer && (
        <div className="streamer-controls">
          <button onClick={() => onStart(gameRoute)}>Start</button>
          <button onClick={() => onManagePlayers(gameRoute)}>Manage Players</button>
        </div>
      )}
    </div>
  );
};

export default StreamersList;

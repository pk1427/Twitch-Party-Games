import React, { useContext } from "react";
import "./MainArea.css";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import GameCard from "./GameCard"; // Use updated GameCard component

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
        gameRoute="/trivia" // Pass the route to the Trivia game
      />
      
   
      <GameCard
        title="Drawing"
        description="Draw and let others guess!"
        playerCount={5}
        isStreamer={isStreamer} // Pass the streamer status to GameCard
        gameRoute="/draw-guess" // Pass the route to the Drawing game
      />
 
      <GameCard
        title="Tic-Tac-Toe"
        description="Draw and let others guess!"
        playerCount={5}
        isStreamer={isStreamer} // Pass the streamer status to GameCard
        gameRoute="/tic-tac-toe" // Pass the route to the Drawing game
      />
    </div>
  );
};

export default MainArea;

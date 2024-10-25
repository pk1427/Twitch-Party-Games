import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import GameLobby from "./pages/GameLobby";

import GameCard from "./components/GameCard";

import TriviaGame from "./components/games/TriviaGame";
import Tic_tt from "./components/games/tic-tac-toe/TicMain";
import DrawingCanvas from "./components/games/drawing-game/DrawingCanvas";
// import Header from "./components/Header";
import './App.css'

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current user info when the component mounts
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => console.log("Error fetching user data:", err));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FirstPage user={user} />} />
          <Route path="/lobby" element={<GameLobby user={user} />} />

          <Route path="/lobby" element={<GameLobby />} />
          <Route path="/" element={<GameCard />} />
          <Route path="/trivia" element={<TriviaGame/>}/>

          <Route path="/tic-tac-toe" element={<Tic_tt/>}/>
          <Route path="/drawing" element={<DrawingCanvas/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

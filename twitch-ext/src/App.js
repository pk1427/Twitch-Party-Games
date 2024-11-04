import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import GameLobby from "./pages/GameLobby";
import GameCard from "./components/GameCard";
import Tic_tt from "./components/games/tic-tac-toe/TicMain";
import GameRoom from "./components/games/DrawNGuessFrenzy/GameRoom";
// import DotApp from "./components/games/dots-and-boxes/DotApp";
import Game_trivia from "./components/games/trivia/Game_trivia";
import Creator from "./pages/Creator";

import StreamersList from "./pages/StreamersList";
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);



  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FirstPage user={user} />} />
          <Route path="/lobby" element={<GameLobby user={user} />} />
          <Route path="/lobby" element={<GameLobby />} />
          <Route path="/" element={<GameCard />} />
          <Route path="/tic-tac-toe" element={<Tic_tt />} />
          <Route path="/draw-guess" element={<GameRoom />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/trivia" element={<Game_trivia/>}/>
          <Route path="/streamers" element={<StreamersList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
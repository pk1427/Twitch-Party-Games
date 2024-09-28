import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import GameLobby from "./pages/GameLobby";
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;

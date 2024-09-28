import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import logo from "../assets/logo.png";
import './Header.css'

const Header = () => {
  const { user } = useContext(AuthContext); // Get user data from AuthContext

  return (
    <header className="header-lobby">
      <div className="logo">
        <img src={logo} alt="Game Logo" className="logo-image" />
      </div>

      <div className="title">
        <h1>Game Lobby</h1>
      </div>

      <div className="user-profile">
        <img
          src={user?.profile_image_url || "placeholder-avatar.png"}
          alt={user?.display_name || "Guest"}
          className="avatar"
        />
        <span className="username">{user?.display_name || "Guest"}</span>
        <div className="dropdown">
          <button className="dropdown-button">▼</button>
          <div className="dropdown-content">
            <a href="/">Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

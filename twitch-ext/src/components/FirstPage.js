import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Importing AuthContext
import "./FirstPage.css"; // Assuming you will add styles here
import logo from "../assets/logo.png";
import twitchLogo from "../assets/twitch-logo-png-1858.png"; // Corrected import statement
import triviaFirst from "../assets/trivia-game.jpg"; // Corrected import statement
import twitchPartyImage from "../assets/twitch-party-main.jpeg"; // Add the image describing Twitch Party Games
import guessgame from "../assets/guessing-game.jpg";
import drawgame from "../assets/drawing-game.jpg";
// import GameLobby from "../pages/GameLobby";

const FirstPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Accessing user from AuthContext

  const handleGoHome = () => {
    if (user) {
      navigate("/streamers"); // Redirect to home if authenticated
    } else {
      alert("Please log in first!");
    }
  };

  const handleLoginAsStreamer = () => {
    window.location.href = "http://localhost:3000/auth/twitch/streamer"; // Redirect to streamer login
  };

  const handleLoginAsViewer = () => {
    window.location.href = "http://localhost:3000/auth/twitch/viewer"; // Redirect to viewer login
  };

  return (
    <div className="first-page-container">
      {/* Header Section */}
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="app-title">Twitch Party Games</h1>
        {!user ? ( // Check if user is not authenticated
          <div className="login-buttons">
            <button className="login-button" onClick={handleLoginAsViewer}>
              <img src={twitchLogo} alt="Twitch Logo" className="twitch-logo" />
              Login as Viewer
            </button>
            <button className="login-button" onClick={handleLoginAsStreamer}>
            {/* <a href="/creators" className="login-button"> */}
              <img src={twitchLogo} alt="Twitch Logo" className="twitch-logo" />
              Login as Streamer
            {/* </a> */}
            </button>
          </div>
        ) : (
          <div className="user-info">
            <h2>{user.display_name}</h2>
            <img
              src={user.profile_image_url}
              alt="Profile"
              className="profile-image"
            />
          </div>
        )}
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        <p className="welcome-message">
          Welcome to Twitch Party Games! Enjoy a variety of fun games with your
          friends.
        </p>
        <img
          src={twitchPartyImage}
          alt="Twitch Party Games"
          className="welcome-image"
        />
      </main>

      {/* Feature highlights */}
      <div className="feature-highlights">
        <div className="feature">
          <img src={triviaFirst} alt="Trivia Icon" />
          <h3>Trivia Game</h3>
          <p>Test your knowledge in various categories!</p>
        </div>
        <div className="feature">
          <img src={guessgame} alt="Guessing Icon" />
          <h3>Guessing Game</h3>
          <p>Guess the word based on hints or images!</p>
        </div>
        <div className="feature">
          <img src={drawgame} alt="Drawing Icon" />
          <h3>Drawing Game</h3>
          <p>Challenge your creativity with fun drawing games!</p>
        </div>
      </div>

      <button className="cta-button" onClick={handleGoHome} href="/lobby">
        Go to Games
      </button>

      {/* Footer Section */}
      <footer className="footer">
        <a href="/terms" className="footer-link">
          Terms of Service
        </a>
        <a href="/privacy" className="footer-link">
          Privacy Policy
        </a>
        <a href="/help" className="footer-link">
          Help Center
        </a>
      </footer>
    </div>
  );
};

export default FirstPage;

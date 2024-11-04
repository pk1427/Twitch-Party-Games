import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Creator.css"; // Import CSS file

const Creator = () => {
  const [streamers, setStreamers] = useState([]);
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/lobby");
  };

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await fetch(
          "http://https://twitch-party-games-2.onrender.com/auth/getAllStreamers"
        );
        const data = await response.json();
        setStreamers(data);
      } catch (error) {
        console.error("Error fetching streamers:", error);
      }
    };

    fetchStreamers();
  }, []);

  return (
    <div className="creator-container">
      <h1 className="creator-title">Creator Page</h1>
      {streamers.length > 0 ? (
        <ul className="streamers-list">
          {streamers.map((streamer) => (
            <li key={streamer.id} className="streamer-item">
              <img
                src={streamer.profile_image_url}
                alt={`${streamer.display_name}'s profile`}
                className="streamer-avatar"
              />
              <p className="streamer-name">{streamer.display_name}</p>
              <p className="streamer-email">{streamer.email}</p>
              <p className="streamer-status">
                {streamer.isOnline ? (
                  <div>
                    <button className="play-button" onClick={handleChange}>
                      Play Game
                    </button>
                  </div>
                ) : (
                  "Offline"
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-streamers">No streamers found.</p>
      )}
    </div>
  );
};

export default Creator;

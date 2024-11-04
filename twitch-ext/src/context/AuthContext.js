// /src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // To make requests to the backend

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
        const response = await axios.get(
          "http://https://twitch-party-games.onrender.com/user",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
            withCredentials: true, // Include cookies for session validation
          }
        );
        setUser(response.data); // Sets the entire user object from the backend
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in."); // Set error state if unauthorized
        } else {
          setError("An error occurred while fetching user data.");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, error }}>
      {children}
    </AuthContext.Provider>
  );
};

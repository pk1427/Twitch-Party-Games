// /src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // To make requests to the backend

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user", {
          withCredentials: true, // Include cookies for session validation
        });
        setUser(response.data); // Sets the entire user object from the backend
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

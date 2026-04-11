import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated as checkTokenValid } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkTokenValid());

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(checkTokenValid());
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [token]);

  // Auto-logout when token expires mid-session (checked every 60 seconds)
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      if (!checkTokenValid()) {
        setToken(null);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

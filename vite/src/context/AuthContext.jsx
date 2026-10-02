import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('payvault_token') || null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to PayVault Digital Wallet System!", time: new Date().toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getCurrentUser()
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    setToken(res.data.access_token);
    const profile = await api.getCurrentUser();
    setUser(profile.data);
    addNotification(`Signed in successfully as @${profile.data.username}`);
    return profile.data;
  };

  const register = async (username, email, password) => {
    const res = await api.register(username, email, password);
    setToken(res.data.access_token);
    const profile = await api.getCurrentUser();
    setUser(profile.data);
    addNotification(`Account created successfully! Welcome @${profile.data.username}`);
    return profile.data;
  };

  const logout = () => {
    localStorage.removeItem('payvault_token');
    setToken(null);
    setUser(null);
  };

  const addNotification = (message) => {
    setNotifications(prev => [{ id: Date.now(), message, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const refreshUser = async () => {
    if (token) {
      const profile = await api.getCurrentUser();
      setUser(profile.data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, notifications, addNotification, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
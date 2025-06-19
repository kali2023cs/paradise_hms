import React, { createContext, useState, useEffect, useContext } from 'react';
import api from './axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const propertyCode = localStorage.getItem('property_code');

        if (token && propertyCode) {
          const response = await api.get('/user');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error loading user', error);
        localStorage.removeItem('token');
        localStorage.removeItem('property_code');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password, property_code) => {
    const response = await api.post('/login', { email, password, property_code });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('property_code', response.data.property_code); // <- store for future use
    setUser(response.data.user);
  };


  const register = async (name, email, password) => {
    const response = await api.post('/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
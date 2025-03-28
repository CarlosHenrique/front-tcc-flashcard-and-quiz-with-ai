import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { VERIFY_TOKEN } from '../graphql/auth/queries';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [verifyToken] = useLazyQuery(VERIFY_TOKEN, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.verifyToken) {
        setUser(data.verifyToken);
        setUserId(data.verifyToken.id);
        setToken(localStorage.getItem('token'));
        localStorage.setItem('userId', data.verifyToken.id);
      } else {
        logout();
      }
      setLoading(false);
    },
    onError: () => {
      logout();
      setLoading(false);
    },
  });

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        await verifyToken();
      } else {
        setLoading(false);
        navigate('/login');
      }
    };
    checkToken();
  }, [verifyToken, navigate]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}
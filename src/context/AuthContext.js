import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { VERIFY_TOKEN } from '../graphql/auth/queries';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [verifyToken] = useLazyQuery(VERIFY_TOKEN, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    },
    onCompleted: (data) => {
      if (data && data.verifyToken) {
        setUser(data.verifyToken);
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
      const token = localStorage.getItem('token');
      if (token) {
        await verifyToken();
      } else {
        setLoading(false);
        navigate('/login');
      }
    };
    checkToken();
  }, [verifyToken, navigate]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

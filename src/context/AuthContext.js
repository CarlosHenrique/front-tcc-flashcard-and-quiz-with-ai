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
        console.log('🔹 Token verificado com sucesso:', data.verifyToken);
        setUser(data.verifyToken);
        setUserId(data.verifyToken.id);
        setToken(localStorage.getItem('token'));
        localStorage.setItem('userId', data.verifyToken.id);
      } else {
        logout();
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('⛔ Erro na verificação do token:', error);
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


  const login = (userData, authToken, userIdentifier, redirectTo = '/') => {
    console.log('✅ Login bem-sucedido:', userData);
    setUser(userData);
    setToken(authToken);
    setUserId(userIdentifier);
    localStorage.setItem('token', authToken);
    localStorage.setItem('userId', userIdentifier);
    
    setTimeout(() => {
      console.log('🔄 Tentando redirecionar para:', redirectTo);
      navigate(redirectTo); // Verifica se o navigate realmente está sendo chamado
    }, 100);
  };
  
  
  const logout = () => {
    console.log('🚪 Realizando logout...');
    setUser(null);
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setTimeout(() => {
      navigate('/login'); // 🔄 Redireciona para login após limpar o estado
    }, 100);
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_DECKS } from '../graphql/decks/queries';

const FlashcardsContext = createContext();

export const useFlashcards = () => {
  return useContext(FlashcardsContext);
};

export const FlashcardsProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [hasToken, setHasToken] = useState(false);
  const [fetchDecks, { data, loading, error }] = useLazyQuery(GET_ALL_DECKS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setHasToken(true);
      fetchDecks(); // Faz a query apenas se o token estiver disponível
    } else {
      console.log('Token não disponível.');
    }
  }, [fetchDecks]);

  useEffect(() => {
    if (data) {
      console.log('Data recebido do backend:', data); // Verifica os dados brutos recebidos
      setDecks(data.getAllDecks);
    }
  }, [data]);

  if (!hasToken) {
    return <div>Carregando...</div>; // Exibe um loading ou nada se não houver token
  }

  return (
    <FlashcardsContext.Provider value={{ decks, loading, error }}>
      {children}
    </FlashcardsContext.Provider>
  );
};

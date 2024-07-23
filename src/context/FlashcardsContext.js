// src/context/FlashcardsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_DECKS } from '../graphql/decks/queries';

const FlashcardsContext = createContext();

export const useFlashcards = () => {
  return useContext(FlashcardsContext);
};

export const FlashcardsProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchDecks, { data, error }] = useLazyQuery(GET_ALL_DECKS, { fetchPolicy: 'no-cache',});

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  useEffect(() => {
    if (data) {
      setDecks(data.getAllDecks);
      setLoading(false);
    }
  }, [data]);

  return (
    <FlashcardsContext.Provider value={{ decks, loading, error }}>
      {children}
    </FlashcardsContext.Provider>
  );
};

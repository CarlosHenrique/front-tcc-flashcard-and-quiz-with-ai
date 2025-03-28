import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ALL_DECKS } from '../graphql/decks/queries';
import { useAuth } from '../context/AuthContext';
import { SAVE_DECK_RESPONSE } from '../graphql/decks/mutations';

const FlashcardsContext = createContext();

export const useFlashcards = () => useContext(FlashcardsContext);

export const FlashcardsProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [userDeckResponses, setUserDeckResponses] = useState({});
  const [saveDeckResponse, { loading: mutationLoading, error: mutationError }] = useMutation(SAVE_DECK_RESPONSE);
  const [fetchDecks, { data, loading, error }] = useLazyQuery(GET_ALL_DECKS, {
    fetchPolicy: 'no-cache',
  });

  const { user, token, loading: authLoading } = useAuth();
  const userId = user?.email;

  useEffect(() => {
    if (token) {
      fetchDecks({
        variables: { id: userId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }, [token, userId, fetchDecks]);

  useEffect(() => {
    if (data) {
      setDecks(data.getAllDecksFromUser);
    }
  }, [data]);

  const updateCardMetrics = (deckId, cardId, correct, currentAttempt) => {
    if (!user) {
      return;
    }

    const deck = decks.find((d) => d.id === deckId);
    if (!deck) {
      return;
    }

    const response = userDeckResponses[deckId] || {
      userId,
      deckId,
      selectedCardsIds: [],
      score: 0,
      cardMetrics: [],
      date: new Date(),
    };

    if (!response.selectedCardsIds.includes(cardId)) {
      response.selectedCardsIds.push(cardId);
    }

    let cardMetrics = response.cardMetrics.find((metric) => metric.cardId === cardId);

    if (!cardMetrics) {
      cardMetrics = {
        cardId,
        attempts: 0,
        score: 0,
        lastAttempt: new Date(),
        nextReviewDate: new Date(),
      };
      response.cardMetrics.push(cardMetrics);
    }

    cardMetrics.attempts += 1;
    cardMetrics.lastAttempt = new Date();

    if (correct) {
      let attemptScore = 1;
      if (cardMetrics.attempts === 1) attemptScore = 10;
      else if (cardMetrics.attempts === 2) attemptScore = 7;
      else if (cardMetrics.attempts === 3) attemptScore = 4;

      cardMetrics.score += attemptScore;
      response.score += attemptScore;
    } else {
      const currentCardIndex = deck.cards.findIndex((c) => c.id === cardId);
      if (currentCardIndex !== -1) {
        const randomIndex = Math.floor(Math.random() * (deck.cards.length - currentCardIndex - 1)) + currentCardIndex + 1;
        deck.cards.splice(randomIndex, 0, deck.cards[currentCardIndex]);
      }
    }

    const baseInterval = correct ? cardMetrics.attempts : 1;
    cardMetrics.nextReviewDate = new Date(Date.now() + baseInterval * 24 * 60 * 60 * 1000);

    setUserDeckResponses((prevState) => ({
      ...prevState,
      [deckId]: response,
    }));
  };

  const mapUserDeckResponses = () => {
    return Object.values(userDeckResponses).map((response) => {
      const originalCards = response.selectedCardsIds.slice(0, 10);
      const originalMetrics = response.cardMetrics.filter(metric => 
        originalCards.includes(metric.cardId)
      );

      return {
        userId: response.userId,
        deckId: response.deckId,
        selectedCardsIds: originalCards,
        score: response.score,
        cardMetrics: originalMetrics,
        date: response.date.toISOString(),
      };
    });
  };

  const submitResponse = async (finalResponse) => {
    try {
      const { data } = await saveDeckResponse({
        variables: { input: finalResponse }
      });

      if (mutationError) {
        throw new Error('Erro ao enviar respostas via GraphQL');
      }

      return data;
    } catch (error) {
      throw error;
    } finally {
      resetSession();
    }
  };

  const resetSession = () => {
    setUserDeckResponses({});
  };

  const getDeckById = (deckId) => {
    if (!decks || decks.length === 0) {
      return null;
    }
    
    const deck = decks.find(d => d.id === deckId);
    
    if (!deck) {
      return null;
    }
    
    return deck;
  };

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  if (!user || !token) {
    return <div>Usuário não autenticado. Por favor, faça login.</div>;
  }

  return (
    <FlashcardsContext.Provider value={{ decks, submitResponse, updateCardMetrics, resetSession, loading, error, fetchDecks, getDeckById }}>
      {children}
    </FlashcardsContext.Provider>
  );
};

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
    } else {
      console.log('Token ou userId não disponível.');
    }
  }, [token, userId, fetchDecks]);

  useEffect(() => {
    if (data) {
      
      setDecks(data.getAllDecksFromUser);
    }
  }, [data]);

  const updateCardMetrics = (deckId, cardId, correct, currentAttempt) => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const deck = decks.find((d) => d.id === deckId);
    if (!deck) {
      console.error(`Deck com ID ${deckId} não encontrado.`);
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

  /**
   * Mapeia `userDeckResponses` para o formato correto antes de enviar a mutação GraphQL.
   */
  const mapUserDeckResponses = () => {
    return Object.values(userDeckResponses).map((response) => ({
      userId: response.userId,
      deckId: response.deckId,
      selectedCardsIds: response.selectedCardsIds,
      score: response.score,
      cardMetrics: response.cardMetrics.map((metric) => ({
        cardId: metric.cardId,
        attempts: metric.attempts,
        score: metric.score,
        lastAttempt: metric.lastAttempt.toISOString(),
        nextReviewDate: metric.nextReviewDate.toISOString(),
      })),
      date: response.date.toISOString(),
    }));
  };

  /**
   * Envia os dados processados para o backend via GraphQL Mutation.
   */
  const submitResponse = async () => {
    console.log('Preparando para enviar respostas...');

    const formattedResponses = mapUserDeckResponses();


    try {
      const { data } = await saveDeckResponse({
        variables: { input: formattedResponses[0] }
      });

      if (mutationError) {
        throw new Error('Erro ao enviar respostas via GraphQL');
      }

      console.log('Respostas enviadas com sucesso via GraphQL');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }

    resetSession();
    return formattedResponses[0]
  };

  const resetSession = () => {
    setUserDeckResponses({});
    console.log('Session reset');
  };

  // Função para buscar um deck pelo ID
  const getDeckById = (deckId) => {
    if (!decks || decks.length === 0) {
      console.error('Nenhum deck disponível');
      return null;
    }
    
    const deck = decks.find(d => d.id === deckId);
    
    if (!deck) {
      console.error(`Deck com ID ${deckId} não encontrado`);
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

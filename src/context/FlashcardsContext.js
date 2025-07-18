import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ALL_DECKS } from '../graphql/decks/queries';
import { useAuth } from '../context/AuthContext';
import { SAVE_DECK_RESPONSE } from '../graphql/decks/mutations';

const FlashcardsContext = createContext();

export const useFlashcards = () => useContext(FlashcardsContext);

export const FlashcardsProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  // `currentSessionMetrics` é simplificado aqui. A lógica de compilar as métricas
  // para o payload final será movida para o `FlashcardsPage` antes de chamar `submitResponse`.
  // Isso torna o contexto mais focado em fornecer o método de mutação.
  const [currentSessionMetrics, setCurrentSessionMetrics] = useState({}); 

  const [saveDeckResponse, { loading: mutationLoading, error: mutationError }] = useMutation(SAVE_DECK_RESPONSE);
  const [fetchDecks, { data, loading, error }] = useLazyQuery(GET_ALL_DECKS, {
    fetchPolicy: 'no-cache', // Sempre busca dados frescos para refletir o estado atual do usuário/decks
  });

  const { user, token, loading: authLoading } = useAuth();
  const userId = user?.email;

  // Efeito para buscar os decks do usuário quando o token estiver disponível
  useEffect(() => {
    if (token && userId) { // Garante que `token` e `userId` existam antes de buscar os decks
      fetchDecks({
        variables: { id: userId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token para autenticação
          },
        },
      });
    }
  }, [token, userId, fetchDecks]);

  // Efeito para atualizar o estado `decks` quando os dados da query chegarem
  useEffect(() => {
    if (data) {
      setDecks(data.getAllDecksFromUser);
    }
  }, [data]);

  // Esta função agora serve para atualizar o estado local da sessão,
  // mas o payload completo para o backend será montado no `FlashcardsPage`.
const updateCardMetrics = (deckId, cardMetric) => {
  setCurrentSessionMetrics(prevMetrics => {
    const existingDeckMetrics = prevMetrics[deckId] || { selectedCardsIds: [], cardMetrics: [] };

    // Adiciona o cardId ao array se ainda não estiver presente
    if (!existingDeckMetrics.selectedCardsIds.includes(cardMetric.cardId)) {
      existingDeckMetrics.selectedCardsIds.push(cardMetric.cardId);
    }

    const existingCardIndex = existingDeckMetrics.cardMetrics.findIndex(m => m.cardId === cardMetric.cardId);
    const existingCardMetric = existingDeckMetrics.cardMetrics[existingCardIndex];

    const mergedCardMetric = {
      ...existingCardMetric,
      ...cardMetric,
      attempts: (existingCardMetric?.attempts || 0) + (cardMetric.attempts || 0)
    };

    if (existingCardIndex > -1) {
      existingDeckMetrics.cardMetrics[existingCardIndex] = mergedCardMetric;
    } else {
      existingDeckMetrics.cardMetrics.push(mergedCardMetric);
    }

    return {
      ...prevMetrics,
      [deckId]: existingDeckMetrics
    };
  });
};

  // Função para enviar a resposta final da sessão para o backend
  const submitResponse = async (finalResponse) => {
    try {
      // O `finalResponse` já virá formatado corretamente do `FlashcardsPage`,
      // contendo `userId`, `deckId`, `selectedCardsIds`, `totalSessionScore` e `cardMetrics`.
      const { data } = await saveDeckResponse({
        variables: { input: finalResponse },
        context: {
          headers: {
            Authorization: `Bearer ${token}`, // **Importante:** Inclui o token para autenticação na mutação
          },
        },
      });

        if (!data || !data.createUserDeckResponse) {
      throw new Error('Resposta inválida da API: saveDeckResponse retornou vazio.');
    }

      return data;
    } catch (error) {
      console.error('Erro ao enviar respostas no contexto:', error);
      throw error; // Propaga o erro para o componente que chamou `submitResponse`
    } finally {
      resetSession(); // Sempre reseta a sessão após tentar submeter, mesmo em caso de erro
    }
  };

  // Função para resetar o estado das métricas da sessão atual
  const resetSession = () => {
    setCurrentSessionMetrics({}); // Limpa as métricas da sessão atual
  };

  // Função para buscar um deck pelo ID dentro do estado `decks`
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

  // Renderiza um indicador de carregamento ou mensagem de autenticação enquanto os dados do usuário estão sendo carregados
  if (authLoading) {
    return <div>Carregando autenticação...</div>;
  }

  // Se o usuário não estiver autenticado, exibe uma mensagem
  if (!user || !token) {
    return <div>Usuário não autenticado. Por favor, faça login para usar os flashcards.</div>;
  }

  return (
    <FlashcardsContext.Provider
      value={{
        decks,
        submitResponse,
        updateCardMetrics,
        resetSession,
        loading, // Estado de carregamento das queries Apollo
        error,   // Erros das queries Apollo
        fetchDecks,
        getDeckById,
        // `currentSessionMetrics` não é exposto diretamente, pois o `FlashcardsPage` gerencia o seu estado
        // e apenas chama `updateCardMetrics` para registrá-lo.
      }}
    >
      {children}
    </FlashcardsContext.Provider>
  );
};
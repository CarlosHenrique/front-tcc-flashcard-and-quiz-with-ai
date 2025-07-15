import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_QUIZ_BY_DECK_ASSOCIATED_ID, GET_ALL_QUIZZES_FROM_USER } from '../graphql/quiz/queries';
import { useAuth } from '../context/AuthContext';

const QuizContext = createContext();

export const useQuiz = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Renomeado para contextQuizStartTime para evitar confusão com o local no QuizPage
  const [contextQuizStartTime, setContextQuizStartTime] = useState(null); 
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  
  const { user } = useAuth();

  const [fetchQuiz, { data, loading: quizLoading, error: quizError }] = useLazyQuery(GET_QUIZ_BY_DECK_ASSOCIATED_ID, { 
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data && data.getQuizFromUser) {
        setQuizData(data.getQuizFromUser);
        // O quizStartTime agora é definido na função loadQuiz, não aqui
        setQuestionStartTime(new Date()); // Define o início da primeira questão
        setLoading(false);
      } else {
        setError('Dados do quiz não encontrados');
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(error);
      setLoading(false);
    }
  });

  const [fetchAllQuizzesQuery, { data: allQuizzesData, loading: allQuizzesLoading, error: allQuizzesError }] = useLazyQuery(GET_ALL_QUIZZES_FROM_USER, { 
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data && data.getAllQuizzesFromUser) {
        setAllQuizzes(data.getAllQuizzesFromUser);
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(error);
      setLoading(false);
    }
  });

  // loadQuiz agora recebe 'initialStartTime' do QuizPage
  const loadQuiz = useCallback((deckId, initialStartTime) => {
    if (!deckId || !user?.email) {
      setError('Deck ID ou usuário não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setContextQuizStartTime(initialStartTime || new Date()); // Garante que o start time é setado
    
    fetchQuiz({ 
      variables: { 
        deckId, 
        userId: user.email 
      }
    });
  }, [fetchQuiz, user?.email]);

  const fetchAllQuizzes = useCallback(() => {
    if (!user?.email) {
      setError('Usuário não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchAllQuizzesQuery({ 
      variables: { 
        id: user.email 
      }
    });
  }, [fetchAllQuizzesQuery, user?.email]);

  const saveResponse = (questionId, response) => {
    const currentTime = new Date();
    const timeSpentOnQuestion = (currentTime - questionStartTime) / 1000; // tempo em segundos

    setResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex((resp) => resp.questionId === questionId);

      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].response = response;
        updatedResponses[existingResponseIndex].timeSpent = timeSpentOnQuestion;
        return updatedResponses;
      } else {
        return [...prevResponses, { questionId, response, timeSpent: timeSpentOnQuestion }];
      }
    });

    setQuestionTimes((prevTimes) => [...prevTimes, timeSpentOnQuestion]);
    setQuestionStartTime(currentTime);
  };

  const finalizeQuiz = (userId, quizId) => {
    const selectedQuestionIds = responses.map((resp) => resp.questionId);
    const score = responses.filter((resp) => resp.response.isCorrect).length;
    
    let finalTotalQuizTime = 0;
    // Verifica se contextQuizStartTime é um Date object válido antes de subtrair
    if (contextQuizStartTime instanceof Date && !isNaN(contextQuizStartTime.getTime())) {
        finalTotalQuizTime = (new Date().getTime() - contextQuizStartTime.getTime()) / 1000;
    } else {
        console.error("QuizContext - ERROR: contextQuizStartTime is not a valid Date object or is null. Using sum of questionTimes as fallback.");
        // Fallback: Soma dos tempos de cada questão se o tempo total não puder ser calculado
        finalTotalQuizTime = questionTimes.reduce((acc, time) => acc + time, 0);
    }
    
    console.log('Inside Context QUIZ START TIME IS:', contextQuizStartTime);
    console.log('Inside Context TOTAL TIME IS:', finalTotalQuizTime);
    
    const date = new Date(); // Data da finalização
    const questionMetrics = responses.map((resp) => ({ // Removido index, pois não é mais usado
      questionId: resp.questionId,
      attempts: 1, // Assumindo 1 tentativa por questão no quiz
      correct: resp.response.isCorrect,
      timeSpent: resp.timeSpent, // Pegar o timeSpent já salvo na response do saveResponse
    }));

    const userQuizResponse = {
      userId,
      quizId,
      selectedQuestionIds,
      score,
      date,
      questionMetrics,
      totalQuizTime: finalTotalQuizTime, // Este já estará em segundos
    };

    return userQuizResponse;
  };

  const resetQuizContext = () => {
    setQuizData(null);
    setAllQuizzes([]);
    setResponses([]);
    setLoading(false);
    setError(null);
    setContextQuizStartTime(null);
    setQuestionStartTime(null);
    setQuestionTimes([]);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        allQuizzes,
        loadQuiz,
        fetchAllQuizzes,
        responses,
        resetQuizContext,
        saveResponse,
        finalizeQuiz,
        loading: loading || quizLoading || allQuizzesLoading, // Incluir quizLoading aqui
        error: error || quizError || allQuizzesError, // Incluir quizError aqui
        quizStartTime: contextQuizStartTime // Expor para o QuizPage, se necessário para UI
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
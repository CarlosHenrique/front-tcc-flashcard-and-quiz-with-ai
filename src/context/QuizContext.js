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
  const [allQuizzes, setAllQuizzes] = useState([]); // 🔹 Armazena todos os quizzes do usuário
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  
  const { user } = useAuth();

  // 🔹 Query para buscar um quiz específico associado a um deck
  const [fetchQuiz, { data, called, loading: quizLoading, error: quizError }] = useLazyQuery(GET_QUIZ_BY_DECK_ASSOCIATED_ID, { fetchPolicy: 'no-cache' });

  // 🔹 Query para buscar TODOS os quizzes do usuário
  const [fetchAllQuizzesQuery, { data: allQuizzesData, loading: allQuizzesLoading, error: allQuizzesError }] = useLazyQuery(GET_ALL_QUIZZES_FROM_USER, { fetchPolicy: 'no-cache' });

  // 🔹 Carrega um quiz específico pelo deckId
  const loadQuiz = useCallback((deckId) => {
    setLoading(true);
    fetchQuiz({ variables: { deckId, userId: user.email } });
  }, [fetchQuiz, user.email]);

  // 🔹 Busca todos os quizzes do usuário
  const fetchAllQuizzes = useCallback(() => {
    if (user?.email) {
      setLoading(true);
      fetchAllQuizzesQuery({ variables: { id: user.email } });
    }
  }, [fetchAllQuizzesQuery, user]);

  useEffect(() => {
    if (called && !quizLoading && data) {
      setQuizData(data.getQuizFromUser);
      setQuizStartTime(new Date());
      setQuestionStartTime(new Date());
      setLoading(false);
    } else if (quizError) {
      setError(quizError);
      setLoading(false);
    }
  }, [called, quizLoading, data, quizError]);

  useEffect(() => {
    if (allQuizzesData) {
      setAllQuizzes(allQuizzesData.getAllQuizzesFromUser);
      setLoading(false);
    } else if (allQuizzesError) {
      setError(allQuizzesError);
      setLoading(false);
    }
  }, [allQuizzesData, allQuizzesError]);

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
    const totalQuizTime = (new Date() - quizStartTime) / 1000;
    const date = new Date();
    const questionMetrics = responses.map((resp, index) => ({
      questionId: resp.questionId,
      attempts: 1,
      correct: resp.response.isCorrect,
      timeSpent: questionTimes[index],
    }));

    const userQuizResponse = {
      userId,
      quizId,
      selectedQuestionIds,
      score,
      date,
      questionMetrics,
      totalQuizTime,
    };

    console.log('UserQuizResponse:', userQuizResponse);

    return userQuizResponse;
  };

  const resetQuizContext = () => {
    setQuizData(null);
    setAllQuizzes([]); // 🔹 Limpa a lista de quizzes
    setResponses([]);
    setLoading(false);
    setError(null);
    setQuizStartTime(null);
    setQuestionStartTime(null);
    setQuestionTimes([]);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        allQuizzes, // 🔹 Disponibiliza todos os quizzes no contexto
        loadQuiz,
        fetchAllQuizzes, // 🔹 Função para buscar todos os quizzes do usuário
        responses,
        resetQuizContext,
        saveResponse,
        finalizeQuiz,
        loading: loading || allQuizzesLoading, // 🔹 Considera o loading dos quizzes
        error,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

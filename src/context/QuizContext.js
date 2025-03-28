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
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  
  const { user } = useAuth();

  const [fetchQuiz, { data, called, loading: quizLoading, error: quizError }] = useLazyQuery(GET_QUIZ_BY_DECK_ASSOCIATED_ID, { 
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data && data.getQuizFromUser) {
        setQuizData(data.getQuizFromUser);
        setQuizStartTime(new Date());
        setQuestionStartTime(new Date());
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

  const loadQuiz = useCallback((deckId) => {
    if (!deckId || !user?.email) {
      setError('Deck ID ou usuário não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
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

    return userQuizResponse;
  };

  const resetQuizContext = () => {
    setQuizData(null);
    setAllQuizzes([]);
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
        allQuizzes,
        loadQuiz,
        fetchAllQuizzes,
        responses,
        resetQuizContext,
        saveResponse,
        finalizeQuiz,
        loading: loading || allQuizzesLoading,
        error,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

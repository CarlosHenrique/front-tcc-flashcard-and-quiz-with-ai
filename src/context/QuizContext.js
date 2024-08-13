import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_QUIZ_BY_DECK_ASSOCIATED_ID } from '../graphql/quiz/queries';

const QuizContext = createContext();

export const useQuiz = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null); // Início do tempo do quiz
  const [questionStartTime, setQuestionStartTime] = useState(null); // Início do tempo da questão
  const [questionTimes, setQuestionTimes] = useState([]); // Tempo gasto em cada questão

  const [fetchQuiz, { data, called, loading: queryLoading, error: queryError }] = useLazyQuery(GET_QUIZ_BY_DECK_ASSOCIATED_ID, { fetchPolicy: 'no-cache' });

  const loadQuiz = useCallback((deckId) => {
    setLoading(true);
    fetchQuiz({ variables: { input: deckId } });
  }, [fetchQuiz]);
  console.log(quizData)
  useEffect(() => {
    if (called && !queryLoading && data) {
      setQuizData(data.getQuizByDeckAssociatedId);
      setQuizStartTime(new Date()); // Iniciar tempo do quiz
      setQuestionStartTime(new Date()); // Iniciar tempo da primeira questão
      setLoading(false);
    } else if (queryError) {
      setError(queryError);
      setLoading(false);
    }
  }, [called, queryLoading, data, queryError]);

  const saveResponse = (questionId, response) => {
    const currentTime = new Date();
    const timeSpentOnQuestion = (currentTime - questionStartTime) / 1000; // tempo em segundos

    setResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (resp) => resp.questionId === questionId
      );

      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].response = response;
        updatedResponses[existingResponseIndex].timeSpent = timeSpentOnQuestion;
        console.log(updatedResponses)
        return updatedResponses;
      } else {
        console.log([...prevResponses, { questionId, response, timeSpent: timeSpentOnQuestion }])
        return [...prevResponses, { questionId, response, timeSpent: timeSpentOnQuestion }];
      }
    });

    // Salva o tempo gasto na questão atual e reinicia o tempo para a próxima questão
    setQuestionTimes((prevTimes) => [...prevTimes, timeSpentOnQuestion]);
    setQuestionStartTime(currentTime);
  };

  const finalizeQuiz = (userId) => {
    const quizId = quizData._id;
    const selectedQuestionIds = responses.map((resp) => resp.questionId);
    const score = responses.filter(resp => resp.response.isCorrect).length;
    const totalQuizTime = (new Date() - quizStartTime) / 1000; // Tempo total em segundos
    const date = new Date();

    const questionMetrics = responses.map((resp, index) => ({
      questionId: resp.questionId,
      attempts: 1, // Supondo 1 tentativa por questão
      correct: resp.response.isCorrect,
      lastAttemptDate: date,
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

    // Aqui você pode enviar `userQuizResponse` para um servidor ou API conforme necessário
    return userQuizResponse;
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        loadQuiz,
        responses,
        saveResponse,
        finalizeQuiz,
        loading,
        error
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

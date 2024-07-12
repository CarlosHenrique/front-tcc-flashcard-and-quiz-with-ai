// src/components/Quiz.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionWrapper = styled.div`
  margin-bottom: 20px;
`;

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStartTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - quizStartTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStartTime]);

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  return (
    <QuizWrapper>
      <Typography variant="h4">Quiz</Typography>
      <Typography variant="body1">Time Spent: {Math.floor(timeSpent / 1000)} seconds</Typography>
      {currentQuestion < questions.length ? (
        <QuestionWrapper>
          <Typography variant="h5">{questions[currentQuestion].question}</Typography>
          {questions[currentQuestion].options.map(option => (
            <Button key={option} variant="contained" onClick={handleNextQuestion}>
              {option}
            </Button>
          ))}
        </QuestionWrapper>
      ) : (
        <Typography variant="h5">Quiz Completed!</Typography>
      )}
    </QuizWrapper>
  );
};

export default Quiz;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Button, Box } from '@mui/material';
import Header from '../components/Header';

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Centraliza verticalmente */
  padding: 2rem;
  padding-top: 100px; /* Espaço para o header fixo */
  box-sizing: border-box;
`;

const QuestionCard = styled.div`
  background-color: #5650F5;
  color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 90%;
  max-width: 800px; /* Tamanho fixo grande */
  height: 400px; /* Tamanho fixo grande */
  margin: 2rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Espaço entre os itens */
`;

const OptionButton = styled(Button)`
  width: 100%;
  margin: 0.5rem 0;
  background-color: ${props => props.correct ? '#DEEF9C' : props.incorrect ? '#FFCEC6' : '#f0f0f0'} !important;
  color: ${props => props.correct ? '#7AA211' : props.incorrect ? '#E41315' : '#000'} !important;
  &:hover {
    background-color: ${props => props.correct ? '#CFEA70' : props.incorrect ? '#FFB3A9' : '#e0e0e0'} !important;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: #ddd;
    background-color: #dddddd;
    &.correct {
      background-color: #7AA211;
    }
    &.incorrect {
      background-color: #E41315;
    }
    &.current {
      border: 2px solid #b4bfff;
    }
  }
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem; /* Espaço entre os botões */
  margin-top: 1rem;
`;

const OptionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espaço entre os botões */
`;

const quizData = [
  {
    id: 1,
    question: "O que é um loop 'for' utilizado para fazer em programação?",
    options: [
      { text: "Declarar uma variável", correct: false },
      { text: "Executar um bloco de código repetidamente", correct: true },
      { text: "Definir uma função", correct: false },
      { text: "Inverter o valor de uma variável", correct: false }
    ]
  },
  {
    id: 2,
    question: "Qual é a capital da França?",
    options: [
      { text: "Berlim", correct: false },
      { text: "Madrid", correct: false },
      { text: "Paris", correct: true },
      { text: "Lisboa", correct: false }
    ]
  },
  {
    id: 3,
    question: "Qual é o maior planeta do nosso sistema solar?",
    options: [
      { text: "Terra", correct: false },
      { text: "Júpiter", correct: true },
      { text: "Marte", correct: false },
      { text: "Saturno", correct: false }
    ]
  },
  {
    id: 4,
    question: "Quem escreveu 'Hamlet'?",
    options: [
      { text: "Charles Dickens", correct: false },
      { text: "William Shakespeare", correct: true },
      { text: "Mark Twain", correct: false },
      { text: "Jane Austen", correct: false }
    ]
  },
  {
    id: 5,
    question: "Qual é a fórmula química da água?",
    options: [
      { text: "H2O", correct: true },
      { text: "CO2", correct: false },
      { text: "O2", correct: false },
      { text: "NaCl", correct: false }
    ]
  },
  {
    id: 6,
    question: "Qual é a velocidade da luz?",
    options: [
      { text: "300,000 km/s", correct: true },
      { text: "150,000 km/s", correct: false },
      { text: "450,000 km/s", correct: false },
      { text: "600,000 km/s", correct: false }
    ]
  },
];

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(quizData.length).fill(null));
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(quizData.map(() => ({ status: 'pending' }))); // pending, correct, incorrect

  const handleOptionClick = (index) => {
    if (showAnswer) return;

    const isCorrect = quizData[currentQuestionIndex].options[index].correct;
    const newProgress = [...progress];
    newProgress[currentQuestionIndex].status = isCorrect ? 'correct' : 'incorrect';
    setProgress(newProgress);

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = index;
    setSelectedOptions(newSelectedOptions);

    setShowAnswer(true);
  };

  const handleDotClick = (index) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(selectedOptions[index] !== null);
  };

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <QuizWrapper>
      <Header />
      <QuestionCard>
        <Typography variant="h5">{`${currentQuestionIndex + 1}. ${currentQuestion.question}`}</Typography>
        <OptionsWrapper mt={3}>
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => handleOptionClick(index)}
              correct={showAnswer && option.correct}
              incorrect={showAnswer && selectedOptions[currentQuestionIndex] === index && !option.correct}
              disabled={showAnswer}
            >
              {option.text}
            </OptionButton>
          ))}
        </OptionsWrapper>
        {showAnswer && (
          <ButtonWrapper>
            <Button
              variant="contained"
              style={{ backgroundColor: '#f0f0f0', color: '#000' }}
              onClick={() => handleDotClick(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#f0f0f0', color: '#000' }}
              onClick={() => handleDotClick(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex >= quizData.length - 1}
            >
              Próximo
            </Button>
          </ButtonWrapper>
        )}
      </QuestionCard>
      <ProgressDots>
        {progress.map((p, index) => (
          <div
            key={index}
            className={`dot ${p.status} ${index === currentQuestionIndex ? 'current' : ''}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </ProgressDots>
    </QuizWrapper>
  );
};

export default QuizPage;

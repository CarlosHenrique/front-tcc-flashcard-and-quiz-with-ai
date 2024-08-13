import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../../components/Header';
import { useLocation } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';

const shuffleOptions = (options) => {
  const shuffledOptions = options
    .map((option) => ({ option, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ option }) => option);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return shuffledOptions.map((option, index) => ({
    label: `${alphabet[index]}. ${option}`,
    value: option,
  }));
};

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  padding-top: 100px;
  box-sizing: border-box;
`;

const QuestionCard = styled.div`
  background-color: #5650F5;
  color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  height: 600px;
  margin: 2rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const OptionButton = styled(Button)`
  width: 100%;
  margin: 0.5rem 0;
  background-color: ${props =>
    props.disabled ? '#D3D3D3' :
    props.selected ? '#ADD8E6' :
    props.correct ? '#DEEF9C' :
    props.incorrect ? '#FFCEC6' : '#f0f0f0'} !important;
  color: ${props =>
    props.disabled ? '#A9A9A9' :
    props.selected ? '#000' :
    props.correct ? '#7AA211' :
    props.incorrect ? '#E41315' : '#000'} !important;
  &:hover {
    background-color: ${props =>
      props.disabled ? '#D3D3D3' :
      props.selected ? '#ADD8E6' :
      props.correct ? '#CFEA70' :
      props.incorrect ? '#FFB3A9' : '#e0e0e0'} !important;
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
    &.correct {
      background-color: #7AA211;
    }
    &.incorrect {
      background-color: #E41315;
    }
    &.pending {
      background-color: #ddd;
    }
    &.current {
      border: 2px solid #b4bfff;
    }
  }
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const OptionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const QuestionBadge = styled(Chip)`
  margin-bottom: 0.2rem;
  width: 80%;
  height: 2rem;
  align-self: center;
  background-color: #FFFF !important;
  color: #5650F5 !important;
  font-weight: bold !important;
  font-family: 'Rowdies', cursive !important;
`;

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #fff;
    padding: 2rem;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  text-align: center;
  color: #5650F5;
  font-family: 'Rowdies', cursive !important;
`;

const StyledDialogContent = styled(DialogContent)`
  text-align: center;
`;

const StyledDialogActions = styled(DialogActions)`
  display: flex;
  justify-content: center;
`;

const NextQuestionButton = styled(Button)`
  border: 2px solid #5650F5 !important;
  color: #5650F5 !important;
  font-weight: bold !important;
  margin-top: 1rem;
`;

const questionTypeMap = {
  multiple_response: 'Múltipla Resposta',
  case_study: 'Estudo de caso',
  hypothetical_situation: 'Situação Hipotética',
  multiple_choice: 'Múltipla escolha',
  true_false: 'Verdadeiro ou Falso'
};

const QuizPage = () => {
  const location = useLocation();
  const { deck } = location.state;
  const { loadQuiz, quizData, saveResponse, finalizeQuiz, loading, error } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuizData, setShuffledQuizData] = useState(null); 
  const [startTime, setStartTime] = useState(null); // Tempo de início da questão

  useEffect(() => {
    loadQuiz(deck.id);
  }, [deck.id, loadQuiz]);

  useEffect(() => {
    if (quizData) {
      const shuffledQuestions = quizData.questions.map((question) => ({
        ...question,
        shuffledOptions: shuffleOptions(question.options),
      }));
      
      setSelectedOptions(Array(quizData.questions.length).fill([]));
      setProgress(shuffledQuestions.map(() => ({ status: 'pending' })));
      setShuffledQuizData({ ...quizData, questions: shuffledQuestions });
      setStartTime(new Date()); // Iniciar o tempo do quiz
    }
  }, [quizData]);

  useEffect(() => {
    if (progress[currentQuestionIndex]) {
      setShowAnswer(progress[currentQuestionIndex].status !== 'pending');
    }
    
    setSelectedOptions(prevSelected => {
      const newSelected = [...prevSelected];
      newSelected[currentQuestionIndex] = [];
      return newSelected;
    });

    setStartTime(new Date()); // Iniciar o tempo da nova questão
  }, [currentQuestionIndex, progress]);

  const handleOptionClick = (index) => {
    if (showAnswer) return;

    setSelectedOptions(prevSelected => {
      const newSelected = [...prevSelected];
      if (!newSelected[currentQuestionIndex]) {
        newSelected[currentQuestionIndex] = [];
      }
      if (shuffledQuizData.questions[currentQuestionIndex].type === 'multiple_response') {
        if (newSelected[currentQuestionIndex].includes(index)) {
          newSelected[currentQuestionIndex] = newSelected[currentQuestionIndex].filter(i => i !== index);
        } else {
          newSelected[currentQuestionIndex].push(index);
        }
      } else {
        newSelected[currentQuestionIndex] = [index];
      }
      return newSelected;
    });
  };

  const handleSend = () => {
    const currentQuestion = shuffledQuizData.questions[currentQuestionIndex];
    const selected = selectedOptions[currentQuestionIndex] || [];
  
    // Recupera as respostas corretas da questão
    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : currentQuestion.answer.split(', ');
  
    // Obtém os índices das respostas corretas
    const correctIndexes = currentQuestion.shuffledOptions.map((option, index) =>
      correctAnswers.includes(option.value) ? index : null
    ).filter(index => index !== null);
  
    // Verifica se a resposta do usuário está correta
    const isCorrect = selected.length === correctIndexes.length && selected.every(index => correctIndexes.includes(index));
  
    // Cria o array finalAnswer com os valores das opções selecionadas
    const finalAnswer = selected.map(index => currentQuestion.shuffledOptions[index].value);
  
    setIsCorrect(isCorrect);
    setOpenDialog(true);
  
    const timeSpent = (new Date() - startTime) / 1000; // Tempo gasto na questão em segundos
  
    console.log('CURRENT QUESTION', currentQuestion);
    console.log('SELECTED', selected); // Índices das opções selecionadas
    console.log('FINAL ANSWER', finalAnswer); // Valores das opções selecionadas
    console.log('isCorrect', isCorrect);
    console.log('TimeSpent', timeSpent);
  
    // Salva a resposta com o valor finalAnswer em vez de selected
    saveResponse(currentQuestion.id, { finalAnswer, isCorrect, timeSpent });
  
    const newProgress = [...progress];
    newProgress[currentQuestionIndex] = { status: isCorrect ? 'correct' : 'incorrect' };
    setProgress(newProgress);
  
    setShowAnswer(true);
  };

  const handleFinalizar = () => {
    const userId = 'exemplo-de-user-id'; // Aqui você deve obter o userId real, por exemplo, do contexto do usuário
    finalizeQuiz(userId);
  };

  const handleClear = () => {
    setSelectedOptions(prevSelected => {
      const newSelected = [...prevSelected];
      newSelected[currentQuestionIndex] = [];
      return newSelected;
    });
    setShowAnswer(false);
  };

  const handleDotClick = (index) => {
    setCurrentQuestionIndex(index);
    if (progress[index]) {
      setShowAnswer(progress[index].status !== 'pending');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (currentQuestionIndex < shuffledQuizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinalizar();
    }
  };

  const currentQuestion = shuffledQuizData?.questions[currentQuestionIndex];
  const correctAnswers = currentQuestion ? (Array.isArray(currentQuestion.answer)
    ? currentQuestion.answer
    : currentQuestion.answer.split(', ')) : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!shuffledQuizData || !currentQuestion) {
    return <div>No quiz data available.</div>;
  }

  return (
    <QuizWrapper>
      <Header />
      <QuestionCard>
        <QuestionBadge label={questionTypeMap[currentQuestion.type]} color="primary" />
        <Typography variant="h5">{`${currentQuestionIndex + 1}. ${currentQuestion.question}`}</Typography>
        <OptionsWrapper mt={3}>
          {currentQuestion.shuffledOptions && currentQuestion.shuffledOptions.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => handleOptionClick(index)}
              selected={selectedOptions[currentQuestionIndex]?.includes(index)}
              disabled={showAnswer}
            >
              {option.label}
            </OptionButton>
          ))}
        </OptionsWrapper>
        <BottomSection>
          {selectedOptions[currentQuestionIndex]?.length > 0 && !showAnswer && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClear}
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
              >
                Enviar
              </Button>
            </>
          )}
        </BottomSection>
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
          disabled={currentQuestionIndex >= shuffledQuizData.questions.length - 1}
        >
          Próximo
        </Button>
      </ButtonWrapper>

      <StyledDialog open={openDialog} onClose={handleDialogClose}>
        <StyledDialogTitle>{isCorrect ? 'Correto!' : 'Incorreto!'}</StyledDialogTitle>
        <StyledDialogContent>
          <Typography>{currentQuestion.explanation}</Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <NextQuestionButton onClick={handleDialogClose}>
            {currentQuestionIndex === shuffledQuizData.questions.length - 1 ? 'Finalizar' : 'Próxima Pergunta'}
          </NextQuestionButton>
        </StyledDialogActions>
      </StyledDialog>
    </QuizWrapper>
  );
};

export default QuizPage;

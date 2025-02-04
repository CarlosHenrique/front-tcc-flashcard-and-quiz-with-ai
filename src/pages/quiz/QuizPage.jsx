import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useMutation } from '@apollo/client';
import Header from '../../components/Header';
import { NextQuestionButton, BottomSection, OptionButton, OptionsWrapper, QuestionBadge, QuestionCard, QuizWrapper, ProgressDots, ButtonWrapper, StyledDialog, StyledDialogActions, StyledDialogContent, StyledDialogTitle } from './QuizPageStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { SAVE_USER_QUIZ_RESPONSE } from '../../graphql/quiz/mutations';

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

const questionTypeMap = {
  multiple_response: 'Múltipla Resposta',
  case_study: 'Estudo de caso',
  hypothetical_situation: 'Situação Hipotética',
  multiple_choice: 'Múltipla escolha',
  true_false: 'Verdadeiro ou Falso'
};

const QuizPage = () => {
  const [saveQuizUserResponse] = useMutation(SAVE_USER_QUIZ_RESPONSE);
  const location = useLocation();
  const navigate = useNavigate();
  const { deck } = location.state;
  const { loadQuiz, quizData, saveResponse, finalizeQuiz, resetQuizContext, loading, error } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuizData, setShuffledQuizData] = useState(null); 
  const [startTime, setStartTime] = useState(null); 
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [userQuizResponse, setUserQuizResponse] = useState(null);
  const { user } = useAuth();
  const userId = user?.email;

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
      setStartTime(new Date()); 
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

    setStartTime(new Date()); 
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
  
    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : currentQuestion.answer.split(', ');
  
    const correctIndexes = currentQuestion.shuffledOptions.map((option, index) =>
      correctAnswers.includes(option.value) ? index : null
    ).filter(index => index !== null);
  
    const isCorrect = selected.length === correctIndexes.length && selected.every(index => correctIndexes.includes(index));
  
    const finalAnswer = selected.map(index => currentQuestion.shuffledOptions[index].value);
  
    setIsCorrect(isCorrect);
    setOpenDialog(true);
  
    const timeSpent = (new Date() - startTime) / 1000; 
  
    saveResponse(currentQuestion.id, { finalAnswer, isCorrect, timeSpent });
  
    const newProgress = [...progress];
    newProgress[currentQuestionIndex] = { status: isCorrect ? 'correct' : 'incorrect' };
    setProgress(newProgress);
  
    setShowAnswer(true);
  };

  const handleFinalizar = async () => {
    const quizResponse = finalizeQuiz(userId, quizData.id);
    
    try {
      const { data } = await saveQuizUserResponse({
        variables: {
          input: {
            userId: quizResponse.userId,
            quizId: quizResponse.quizId,
            selectedQuestionIds: quizResponse.selectedQuestionIds,
            score: quizResponse.score,
            totalQuizTime: quizResponse.totalQuizTime,
            date: quizResponse.date.toISOString(), // Converte para ISO string
            questionMetrics: quizResponse.questionMetrics.map(metric => ({
              questionId: metric.questionId,
              attempts: metric.attempts,
              timeSpent: metric.timeSpent,
              correct: metric.correct,
            }))
          }
        }
      });
      
      // Se o envio for bem-sucedido, armazene a resposta e abra o diálogo de resultados
      setUserQuizResponse(data.createUserQuizResponse);
      setResultDialogOpen(true);
    } catch (error) {
      console.error("Erro ao salvar a resposta do quiz:", error);
      // Adicionar tratamento de erro aqui, se necessário
    }
  };

  const handleRestartQuiz = () => {
    resetQuizContext();
    setCurrentQuestionIndex(0);
    setResultDialogOpen(false);
    loadQuiz(deck.id); 
  };

  const handleCloseResultDialog = () => {
    setResultDialogOpen(false);
    if (userQuizResponse.score / quizData.questions.length >= 0.7) {
      navigate('/'); 
    } else {
      handleRestartQuiz();
    }
  };

  const handleBackToHome = () => {
    navigate('/'); // 🔄 Navega para a HomePage
    setTimeout(() => {
      window.location.reload(); // 🔄 Força um refresh da página
    }, 100); // Pequeno delay para garantir que a navegação acontece antes do reload
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

      {/* Resultado do Quiz */}
      {userQuizResponse && (
        <StyledDialog open={resultDialogOpen} onClose={handleCloseResultDialog}>
          <StyledDialogTitle>Resultado do Quiz</StyledDialogTitle>
          <StyledDialogContent>
            <Typography variant="h6" style={{ fontWeight: 'bold', color: userQuizResponse.score / quizData.questions.length >= 0.7 ? 'green' : 'red' }}>
              {userQuizResponse.score / quizData.questions.length >= 0.7
                ? `Parabéns! Você acertou ${userQuizResponse.score} de ${quizData.questions.length} questões e passou de fase.`
                : `Você acertou ${userQuizResponse.score} de ${quizData.questions.length} questões. Tente novamente para passar de fase.`}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Tempo total: {userQuizResponse.totalQuizTime.toFixed(2)} segundos
            </Typography>
          </StyledDialogContent>
          <StyledDialogActions>
            <NextQuestionButton onClick={handleBackToHome}>
              Voltar para a tela inicial
            </NextQuestionButton>
            {userQuizResponse.score / quizData.questions.length < 0.7 && (
              <NextQuestionButton onClick={handleRestartQuiz}>
                Reiniciar Quiz
              </NextQuestionButton>
            )}
          </StyledDialogActions>
        </StyledDialog>
      )}
    </QuizWrapper>
  );
};

export default QuizPage;

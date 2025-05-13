import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, LinearProgress, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useMutation } from '@apollo/client';
import Header from '../../components/Header';
import { NextQuestionButton, BottomSection, OptionButton, OptionsWrapper, QuestionBadge, QuestionCard, QuizWrapper, ProgressDots, ButtonWrapper, StyledDialog, StyledDialogActions, StyledDialogContent, StyledDialogTitle, TimerContainer, ActionButton, NavigationButton } from './QuizPageStyles';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { SAVE_USER_QUIZ_RESPONSE } from '../../graphql/quiz/mutations';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import Confetti from 'react-confetti';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Joyride, { STATUS } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user } = useAuth();
  


  const { deck, quiz: quizFromState } = location.state || {};
  const { loading, error, loadQuiz, saveResponse, finalizeQuiz, resetQuizContext } = useQuiz();
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showWelcomePaper, setShowWelcomePaper] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);

  const steps = [
    {
      target: '.question-badge',
      content: 'Aqui você pode ver o tipo da questão que está respondendo.',
      disableBeacon: true,
    },
    {
      target: '.question-text',
      content: 'Leia atentamente a pergunta antes de responder.',
    },
    {
      target: '.options-wrapper',
      content: 'Selecione uma ou mais opções dependendo do tipo da questão.',
    },
    {
      target: '.action-buttons',
      content: 'Use estes botões para limpar sua resposta ou enviá-la.',
    },
    {
      target: '.progress-dots',
      content: 'Acompanhe seu progresso através dos pontos. Você pode clicar neles para navegar entre as questões.',
    },
    {
      target: '.navigation-buttons',
      content: 'Use estes botões para navegar entre as questões.',
    },
    {
      target: '.streak-info',
      content: 'Mantenha sua sequência de acertos para ganhar multiplicadores de pontuação!',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  useEffect(() => {
    console.log('Verificando localStorage...');
    const hasSeenWelcome = localStorage.getItem('hasSeenQuizWelcome');
    console.log('hasSeenWelcome:', hasSeenWelcome);
    
    // Forçar a exibição do paper se o localStorage estiver vazio ou for 'false'
    if (!hasSeenWelcome || hasSeenWelcome === 'false') {
      console.log('Mostrando paper de boas-vindas');
      setShowWelcomePaper(true);
    }
  }, []);

  useEffect(() => {
    if (!location.state) {
    
      navigate('/');
      return;
    }

    if (!location.state.deck || !location.state.quiz) {

      navigate('/');
      return;
    }

   
    setStartTime(new Date());
    
    // Usar os dados do quiz diretamente do location.state
    const shuffledQuestions = location.state.quiz.questions.map((question) => ({
      ...question,
      shuffledOptions: shuffleOptions(question.options),
    }));
    
    setSelectedOptions(Array(location.state.quiz.questions.length).fill([]));
    setProgress(shuffledQuestions.map(() => ({ status: 'pending' })));
    setShuffledQuizData({ ...location.state.quiz, questions: shuffledQuestions });
    setQuestionStartTime(new Date());
    
  }, [location.state, navigate]);

  useEffect(() => {
    if (progress[currentQuestionIndex]) {
      setShowAnswer(progress[currentQuestionIndex].status !== 'pending');
    }
    
    setSelectedOptions(prevSelected => {
      const newSelected = [...prevSelected];
      newSelected[currentQuestionIndex] = [];
      return newSelected;
    });

    setQuestionStartTime(new Date());
  }, [currentQuestionIndex, progress]);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setTotalTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

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

    // Atualiza streak e multiplicador
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setScoreMultiplier(prev => Math.min(prev + 0.2, 2));
      if (streak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      setStreak(0);
      setScoreMultiplier(1);
    }
  
    const timeSpent = (new Date() - questionStartTime) / 1000;
  
    saveResponse(currentQuestion.id, { 
      finalAnswer, 
      isCorrect, 
      timeSpent,
      streak,
      scoreMultiplier 
    });
  
    const newProgress = [...progress];
    newProgress[currentQuestionIndex] = { status: isCorrect ? 'correct' : 'incorrect' };
    setProgress(newProgress);
  
    setShowAnswer(true);
  };

  const handleFinalizar = async () => {
    const quizResponse = finalizeQuiz(user.email, shuffledQuizData.id);
    
    try {
      const { data } = await saveQuizUserResponse({
        variables: {
          input: {
            userId: quizResponse.userId,
            quizId: quizResponse.quizId,
            selectedQuestionIds: quizResponse.selectedQuestionIds,
            score: quizResponse.score,
            totalQuizTime: quizResponse.totalQuizTime,
            date: quizResponse.date.toISOString(),
            questionMetrics: quizResponse.questionMetrics.map(metric => ({
              questionId: metric.questionId,
              attempts: metric.attempts,
              timeSpent: metric.timeSpent,
              correct: metric.correct,
            }))
          }
        }
      });
      
      setUserQuizResponse(data.createUserQuizResponse);
      setResultDialogOpen(true);
    } catch (error) {
      // Tratar erro aqui se necessário
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
    if (userQuizResponse.score / shuffledQuizData.questions.length >= 0.7) {
      navigate('/'); 
    } else {
      handleRestartQuiz();
    }
  };

  const handleBackToHome = () => {
    navigate('/'); // 🔄 Navega para a HomePage
    setTimeout(() => {
    
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

  const handleStartTutorial = () => {
    console.log('Iniciando tutorial...');
    setShowWelcomePaper(false);
    setRunTutorial(true);
    localStorage.setItem('hasSeenQuizWelcome', 'true');
  };

  const handleSkipTutorial = () => {
    console.log('Pulando tutorial...');
    setShowWelcomePaper(false);
    localStorage.setItem('hasSeenQuizWelcome', 'true');
  };

  // Função para resetar o tutorial (para testes)
  const resetTutorial = () => {
    console.log('Resetando tutorial...');
    localStorage.setItem('hasSeenQuizWelcome', 'false');
    setShowWelcomePaper(true);
    setRunTutorial(false);
  };

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
      {showConfetti && <Confetti />}
      <Header />
      
      {/* Botão de teste - remover depois */}
      <Button
        onClick={resetTutorial}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10002,
          backgroundColor: '#5650F5',
          color: 'white',
          '&:hover': {
            backgroundColor: '#7A75F7',
          },
        }}
      >
        Resetar Tutorial
      </Button>

      <AnimatePresence>
        {showWelcomePaper && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 10001,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                maxWidth: 300,
                background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Bem-vindo ao Quiz!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Vamos te mostrar como usar o sistema de quiz para testar seus conhecimentos.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSkipTutorial}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Pular
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleStartTutorial}
                  sx={{
                    backgroundColor: 'white',
                    color: '#5650F5',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Começar Tutorial
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#1976d2',
            zIndex: 10000,
          }
        }}
      />
      
      <QuestionCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box className="streak-info" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon sx={{ color: '#FFD700' }} />
              <Typography variant="h6">Streak: {streak}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#FFD700' }} />
              <Typography variant="h6">x{scoreMultiplier.toFixed(1)}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '1rem' }}>
            <TimerIcon sx={{ color: '#FFD700' }} />
            <Typography variant="h6">
              {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </Typography>
          </Box>
        </Box>

        <QuestionBadge className="question-badge" label={questionTypeMap[currentQuestion.type]} color="primary" />
        <Typography 
          className="question-text" 
          variant="h5" 
          sx={{ 
            mb: 2, 
            maxHeight: '150px', 
            overflowY: 'scroll',
            overflowX: 'hidden',
            padding: '8px',
            position: 'relative',
            display: 'block',
            '&::-webkit-scrollbar': {
              width: '8px',
              display: 'block',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              margin: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#5650F5',
              borderRadius: '4px',
              '&:hover': {
                background: '#7A75F7',
              },
            },
            msOverflowStyle: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#5650F5 rgba(0, 0, 0, 0.1)',
          }}
        >
          {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
        </Typography>
        <OptionsWrapper className="options-wrapper" mt={3} sx={{ maxHeight: '300px', overflowY: 'auto' }}>
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
            <Box className="action-buttons">
              <ActionButton
                variant="clear"
                onClick={handleClear}
                startIcon={<DeleteIcon />}
              >
                Limpar
              </ActionButton>
              <ActionButton
                onClick={handleSend}
                startIcon={<SendIcon />}
              >
                Enviar
              </ActionButton>
            </Box>
          )}
        </BottomSection>
      </QuestionCard>
      <ProgressDots className="progress-dots">
        {progress.map((p, index) => (
          <div
            key={index}
            className={`dot ${p.status} ${index === currentQuestionIndex ? 'current' : ''}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </ProgressDots>
      <ButtonWrapper className="navigation-buttons">
        <NavigationButton
          onClick={() => handleDotClick(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          startIcon={<ArrowBackIcon />}
        >
          Anterior
        </NavigationButton>
        <NavigationButton
          onClick={() => handleDotClick(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex >= shuffledQuizData.questions.length - 1}
          endIcon={<ArrowForwardIcon />}
        >
          Próximo
        </NavigationButton>
      </ButtonWrapper>

      <StyledDialog open={openDialog} onClose={handleDialogClose}>
        <StyledDialogTitle>
          {isCorrect ? '🎉 Correto!' : '❌ Incorreto!'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <Typography>{currentQuestion.explanation}</Typography>
          {isCorrect && streak > 0 && (
            <Typography variant="h6" sx={{ mt: 2, color: '#7AA211' }}>
              Streak: {streak} 🔥
            </Typography>
          )}
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
            <Typography variant="h6" style={{ fontWeight: 'bold', color: userQuizResponse.score / shuffledQuizData.questions.length >= 0.7 ? 'green' : 'red' }}>
              {userQuizResponse.score / shuffledQuizData.questions.length >= 0.7
                ? `Parabéns! Você acertou ${userQuizResponse.score} de ${shuffledQuizData.questions.length} questões e passou de fase.`
                : `Você acertou ${userQuizResponse.score} de ${shuffledQuizData.questions.length} questões. Tente novamente para passar de fase.`}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Tempo total: {userQuizResponse.totalQuizTime.toFixed(2)} segundos
            </Typography>
          </StyledDialogContent>
          <StyledDialogActions>
            <NextQuestionButton onClick={handleBackToHome}>
              Voltar para a tela inicial
            </NextQuestionButton>
            {userQuizResponse.score / shuffledQuizData.questions.length < 0.7 && (
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

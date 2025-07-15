import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Removido LinearProgress, importado no QuizResultModal se necessário
import { useMutation } from '@apollo/client';
import Header from '../../components/Header';
import { NextQuestionButton, BottomSection, OptionButton, OptionsWrapper, QuestionBadge, QuestionCard, QuizWrapper, ProgressDots, ButtonWrapper, StyledDialog, StyledDialogActions, StyledDialogContent, StyledDialogTitle, TimerContainer, ActionButton, NavigationButton } from './QuizPageStyles';
import { useLocation, useNavigate } from 'react-router-dom'; // Removido Navigate
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
import QuizResultModal from '../../components/QuizResultModal'; // Certifique-se de que este caminho está correto!
import { motion, AnimatePresence } from 'framer-motion';

// --- Funções Auxiliares (fora do componente) ---

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

// Função de formatação de tempo (para o timer do cabeçalho)
const formatSecondsToMMSS = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formattedMinutes}:${formattedSeconds}`;
};

// --- Componente Principal QuizPage ---
const QuizPage = () => {
  const [saveQuizUserResponse] = useMutation(SAVE_USER_QUIZ_RESPONSE);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { deck, quiz: quizFromState } = location.state || {};
  // Importando quizData, loading, error e quizStartTime do contexto.
  const { loadQuiz, saveResponse, finalizeQuiz, resetQuizContext, quizData, loading: contextLoading, error: contextError, quizStartTime: contextQuizStartTime } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Para o modal de feedback após cada resposta
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuizData, setShuffledQuizData] = useState(null); 
  
  // Estado local para o timer de exibição na UI
  const [uiTimerTotalSeconds, setUiTimerTotalSeconds] = useState(0); 
  
  const [resultDialogOpen, setResultDialogOpen] = useState(false); // Para o modal de resultado final
  const [userQuizResponse, setUserQuizResponse] = useState(null); // Dados do resultado final
  const [showConfetti, setShowConfetti] = useState(false); // Confetti de acertos
  const [streak, setStreak] = useState(0);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [questionStartTime, setQuestionStartTime] = useState(null); // Tempo de início da questão atual (para o saveResponse)

  // Para o tutorial inicial
  const [showWelcomePaper, setShowWelcomePaper] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);

  // Steps do Joyride para o tutorial
  const steps = [
    { target: '.question-badge', content: 'Aqui você pode ver o tipo da questão que está respondendo.', disableBeacon: true },
    { target: '.question-text', content: 'Leia atentamente a pergunta antes de responder.' },
    { target: '.options-wrapper', content: 'Selecione uma ou mais opções dependendo do tipo da questão.', placement: 'top' }, // Adicionado placement
    { target: '.action-buttons', content: 'Use estes botões para limpar sua resposta ou enviá-la.', placement: 'top' }, // Adicionado placement
    { target: '.progress-dots', content: 'Acompanhe seu progresso através dos pontos. Você pode clicar neles para navegar entre as questões.', placement: 'top' }, // Adicionado placement
    { target: '.navigation-buttons', content: 'Use estes botões para navegar entre as questões.', placement: 'top' }, // Adicionado placement
    { target: '.streak-info', content: 'Mantenha sua sequência de acertos para ganhar multiplicadores de pontuação!', placement: 'bottom' } // Adicionado placement
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  // Efeito para mostrar o papel de boas-vindas do tutorial
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenQuizWelcome');
    if (!hasSeenWelcome || hasSeenWelcome === 'false') {
      setShowWelcomePaper(true);
    }
  }, []);

  // Efeito para carregar o quiz e inicializar estados
  useEffect(() => {
    if (!location.state || !location.state.deck || !location.state.quiz) {
      console.warn("QuizPage: Estado de localização inválido ou faltando dados do quiz. Redirecionando.");
      navigate('/');
      return;
    }

    // AQUI: Chame loadQuiz do contexto APENAS se o quiz ainda não foi carregado ou é um quiz diferente
    // Passamos o new Date() para o contexto para que ele saiba o startTime correto da sessão.
    if (!quizData || quizData.id !== location.state.quiz.id) {
       console.log("QuizPage: Chamando loadQuiz do contexto com new Date().");
       loadQuiz(location.state.deck.id, new Date()); // Passa o startTime inicial para o contexto
    }
   
    // Quando quizData do contexto estiver pronto, preenche shuffledQuizData
    if (quizData && quizData.questions && quizData.id === location.state.quiz.id) {
        const shuffledQuestions = quizData.questions.map((question) => ({
            ...question,
            shuffledOptions: shuffleOptions(question.options),
        }));
        setShuffledQuizData({ ...quizData, questions: shuffledQuestions });
        setSelectedOptions(Array(quizData.questions.length).fill([]));
        setProgress(shuffledQuestions.map(() => ({ status: 'pending' })));
        setQuestionStartTime(new Date()); // Inicia o timer da primeira questão
    }

  }, [location.state, navigate, loadQuiz, quizData]); // Adicionado quizData como dependência

  // Efeito para resetar estado da questão ao navegar (próxima/anterior)
  useEffect(() => {
    if (shuffledQuizData && progress[currentQuestionIndex]) {
      setShowAnswer(progress[currentQuestionIndex].status !== 'pending');
    }
    
    if (progress[currentQuestionIndex] && progress[currentQuestionIndex].status === 'pending') {
      setSelectedOptions(prevSelected => {
        const newSelected = [...prevSelected];
        newSelected[currentQuestionIndex] = [];
        return newSelected;
      });
    }

    setQuestionStartTime(new Date()); // Reseta o timer da questão ao mudar
  }, [currentQuestionIndex, progress, shuffledQuizData]);

  // Efeito para o timer global do quiz (exibição na UI)
  useEffect(() => {
    // uiTimerTotalSeconds usa o quizStartTime do CONTEXTO como base
    if (contextQuizStartTime) {
      const interval = setInterval(() => {
        // Calcula a diferença em segundos a partir do quizStartTime do contexto
        setUiTimerTotalSeconds(Math.floor((new Date().getTime() - contextQuizStartTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contextQuizStartTime]); // Dependência do quizStartTime do contexto

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

    let correctAnswersArray;

    if (currentQuestion.type === 'multiple_response') {
      correctAnswersArray = Array.isArray(currentQuestion.answer)
        ? currentQuestion.answer
        : [currentQuestion.answer]; 
    } else {
      correctAnswersArray = [currentQuestion.answer];
    }

    const correctIndexes = currentQuestion.shuffledOptions.map((option, index) =>
      correctAnswersArray.includes(option.value) ? index : null
    ).filter(index => index !== null);

    const isCorrect = selected.length === correctIndexes.length && selected.every(index => correctIndexes.includes(index));

    const finalAnswer = selected.map(index => currentQuestion.shuffledOptions[index].value);

    setIsCorrect(isCorrect);
    setOpenDialog(true);

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

    const timeSpent = (new Date().getTime() - questionStartTime.getTime()) / 1000; // Garantir .getTime()

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
    if (!user || !shuffledQuizData) {
      console.error("Dados do usuário ou quiz ausentes para finalizar.");
      return;
    }
    const quizResponse = finalizeQuiz(user.email, shuffledQuizData.id);
    
    try {
      const { data } = await saveQuizUserResponse({
        variables: {
          input: {
            userId: quizResponse.userId,
            quizId: quizResponse.quizId,
            selectedQuestionIds: quizResponse.selectedQuestionIds,
            score: quizResponse.score,
            // Passar o totalQuizTime como segundos inteiros ou com 2 casas decimais para o backend
            totalQuizTime: parseFloat(quizResponse.totalQuizTime.toFixed(2)), // Envia como float em segundos para o backend
            date: quizResponse.date.toISOString(),
            questionMetrics: quizResponse.questionMetrics.map(metric => ({
              questionId: metric.questionId,
              attempts: metric.attempts,
              timeSpent: parseFloat(metric.timeSpent.toFixed(2)), // Garante que timeSpent também é float formatado
              correct: metric.correct,
            }))
          }
        }
      });
      
      setUserQuizResponse(data.createUserQuizResponse);
      setResultDialogOpen(true);
    } catch (error) {
      console.error("Erro ao salvar a resposta final do quiz:", error);
      setUserQuizResponse({
        score: quizResponse.score,
        totalQuizTime: quizResponse.totalQuizTime, // Passa o valor calculado do contexto para exibição no modal
      });
      setResultDialogOpen(true);
    }
  };

  const handleRestartQuiz = () => {
    resetQuizContext();
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setProgress(shuffledQuizData.questions.map(() => ({ status: 'pending' })));
    setShowAnswer(false);
    setResultDialogOpen(false);
    setStreak(0);
    setScoreMultiplier(1);
    setUiTimerTotalSeconds(0); // Reseta o timer da UI
    loadQuiz(deck.id, new Date()); // Passa um novo startTime para o contexto
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
    resetQuizContext();
    navigate('/');
  };

  const handleClear = () => {
    setSelectedOptions(prevSelected => {
      const newSelected = [...prevSelected];
      newSelected[currentQuestionIndex] = [];
      return newSelected;
    });
  };

  const handleDotClick = (index) => {
    if (progress[currentQuestionIndex].status !== 'pending' || Math.abs(currentQuestionIndex - index) === 1) {
      setCurrentQuestionIndex(index);
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

  const handleStartTutorial = () => {
    setShowWelcomePaper(false);
    setRunTutorial(true);
    localStorage.setItem('hasSeenQuizWelcome', 'true');
  };

  const handleSkipTutorial = () => {
    setShowWelcomePaper(false);
    localStorage.setItem('hasSeenQuizWelcome', 'true');
  };

  const resetTutorial = () => {
    localStorage.setItem('hasSeenQuizWelcome', 'false');
    setShowWelcomePaper(true);
    setRunTutorial(false);
  };

  // Exibição de loading ou erro (usando os estados do contexto agora)
  if (contextLoading || !shuffledQuizData) {
    return (
      <QuizWrapper>
        <Header />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Carregando quiz...</Typography>
        </Box>
      </QuizWrapper>
    );
  }

  if (contextError) {
    return (
      <QuizWrapper>
        <Header />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>Erro ao carregar o quiz: {contextError.message}</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>Voltar ao Início</Button>
        </Box>
      </QuizWrapper>
    );
  }

  return (
    <QuizWrapper>
      {showConfetti && <Confetti />}
      <Header />
      
      <Button
        onClick={resetTutorial}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10002,
          backgroundColor: '#5650F5',
          color: 'white',
          '&:hover': { backgroundColor: '#7A75F7' },
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
            style={{ position: 'fixed', top: 20, right: 20, zIndex: 10001 }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 2, maxWidth: 300,
                background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                color: 'white', borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Bem-vindo ao Quiz!</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Vamos te mostrar como usar o sistema de quiz para testar seus conhecimentos.</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" size="small" onClick={handleSkipTutorial}
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                  Pular
                </Button>
                <Button variant="contained" size="small" onClick={handleStartTutorial}
                  sx={{ backgroundColor: 'white', color: '#5650F5', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
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
        styles={{ options: { primaryColor: '#1976d2', zIndex: 10000 } }}
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
              {formatSecondsToMMSS(uiTimerTotalSeconds)}
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
            '&::-webkit-scrollbar': { width: '8px', display: 'block' },
            '&::-webkit-scrollbar-track': { background: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', margin: '4px' },
            '&::-webkit-scrollbar-thumb': {
              background: '#5650F5', borderRadius: '4px',
              '&:hover': { background: '#7A75F7' },
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

      {userQuizResponse && shuffledQuizData && (
        <QuizResultModal
          open={resultDialogOpen}
          score={userQuizResponse.score}
          totalQuestions={shuffledQuizData.questions.length}
          totalTime={userQuizResponse.totalQuizTime} // Passa o tempo como está vindo do contexto (já em segundos)
          onClose={handleCloseResultDialog}
          onRestartQuiz={handleRestartQuiz}
          onBackToHome={handleBackToHome}
        />
      )}
    </QuizWrapper>
  );
};

export default QuizPage;
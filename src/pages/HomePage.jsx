import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box, Paper, Button, Snackbar, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Joyride, { STATUS } from 'react-joyride';
import PhaseCarousel from '../components/PhaseCarousel';
import Header from '../components/Header';
import { useFlashcards } from '../context/FlashcardsContext';
import { useQuiz } from '../context/QuizContext';

// Componente de partículas flutuantes para o fundo
const FloatingParticles = () => {
  return (
    <ParticlesContainer>
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: `rgba(86, 80, 245, ${0.1 + Math.random() * 0.2})`,
          }}
        />
      ))}
    </ParticlesContainer>
  );
};

// Estilos
const HomeWrapper = styled(motion.div)`
  padding: 8rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  box-sizing: border-box;
  overflow-x: hidden;
  width: 100%;
`;

const StyledTypography = styled(motion.div)`
  margin-bottom: 2rem;
  color: #5650F5;
  text-align: center;
  position: relative;
  width: 100%;
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  z-index: 0;
`;

const WelcomeMessage = styled(motion.div)`
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  padding: 0 1rem;
  width: 100%;
`;

const WelcomePaper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(86, 80, 245, 0.2);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
`;

const VideoIntroCard = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(86, 80, 245, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 320px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(86, 80, 245, 0.3);
  }

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    max-width: 280px;
  }
`;

const VideoOptions = styled(Box)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 101;
`;

const PlayIconWrapper = styled.div`
  background: linear-gradient(45deg, #5650F5 30%, #7A75F7 90%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(86, 80, 245, 0.3);
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomePage = () => {
  const { decks, loading: loadingFlashcards, error: errorFlashcards } = useFlashcards();
  const { allQuizzes, fetchAllQuizzes, loading: loadingQuizzes, error: errorQuizzes } = useQuiz();

  // Estados
  const [openModal, setOpenModal] = useState(false);
  const [openMessage, setOpenMessage] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    return !hasSeenTutorial;
  });
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const steps = [
    {
      target: 'body',
      content: 'Bem-vindo à nossa plataforma de aprendizado! Vamos te guiar em uma rápida tour para você aproveitar ao máximo sua experiência.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.video-button',
      content: 'Comece assistindo ao vídeo introdutório da plataforma. Ele te dará uma visão geral de como tudo funciona!',
      placement: 'left',
    },
    {
      target: '.phase-carousel',
      content: 'Aqui você encontrará todas as fases disponíveis. Cada fase segue uma sequência específica: primeiro assista ao vídeo da fase, depois pratique com os flashcards e por fim, teste seus conhecimentos no quiz.',
      placement: 'bottom',
    },
    {
      target: '.phase-carousel',
      content: 'Para avançar para a próxima fase, você precisa atingir uma pontuação mínima de 70% no quiz. Não se preocupe, você pode tentar quantas vezes quiser!',
      placement: 'bottom',
    },
    {
      target: '.phase-carousel',
      content: 'Ao completar cada atividade, você ganhará badges especiais! Colecione todos os badges de cada fase para mostrar seu progresso.',
      placement: 'bottom',
    },
    {
      target: '.phase-carousel',
      content: 'Os badges são conquistados ao: completar o vídeo da fase, acertar 100% dos flashcards e atingir pontuação máxima no quiz. Boa sorte!',
      placement: 'bottom',
    }
  ];

  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

  const handleStartTutorial = () => {
    setShowWelcome(false);
    setRunTutorial(true);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleSkipTutorial = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleOpenOptions = () => {
    setShowOptionsModal(true);
  };

  const handleCloseOptions = () => {
    setShowOptionsModal(false);
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  // Efeito para mostrar confetti na primeira visita
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    if (!hasSeenTutorial) {
      setShowConfetti(true);
      localStorage.setItem('hasSeenTutorial', 'true');
      
      // Dispara o confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#5650F5', '#4840e6', '#7A75F7']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#5650F5', '#4840e6', '#7A75F7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();

      // Limpa o confetti após alguns segundos
      setTimeout(() => {
        setShowConfetti(false);
      }, duration);
    }
  }, []);

  if (loadingFlashcards || loadingQuizzes) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <CircularProgress size={60} thickness={5} sx={{ color: '#5650F5' }} />
        </motion.div>
      </Box>
    );
  }

  if (errorFlashcards) {
    return <p>Erro: {errorFlashcards.message}</p>;
  }

  if (errorQuizzes) {
    return <p>Erro: {errorQuizzes.message}</p>;
  }

  if (decks.length === 0) {
    return <p>Nenhum deck disponível.</p>;
  }

  return (
    <HomeWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#5650F5',
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#5650F5',
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
      />
      <FloatingParticles />
      <Header />
      
      <ContentContainer>
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              style={{ 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                background: 'rgba(255,255,255,0.9)',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                maxWidth: '90%'
              }}
            >
              <Typography variant="h4" sx={{ color: '#5650F5', textAlign: 'center', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Bem-vindo(a) à Plataforma de Aprendizado!
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                Comece sua jornada de aprendizado agora!
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Paper */}
        <AnimatePresence>
          {showWelcome && (
            <WelcomePaper
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Typography variant="h5" sx={{ color: '#5650F5', fontWeight: 'bold', mb: 2 }}>
                Bem-vindo à Plataforma!
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                Gostaria de fazer um tour guiado pela plataforma para conhecer todas as funcionalidades?
              </Typography>
              <ButtonGroup>
                <Button
                  variant="contained"
                  onClick={handleStartTutorial}
                  sx={{
                    background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4840e6 30%, #6965e7 90%)'
                    }
                  }}
                >
                  Começar Tour
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSkipTutorial}
                  sx={{ color: '#5650F5', borderColor: '#5650F5' }}
                >
                  Pular
                </Button>
              </ButtonGroup>
            </WelcomePaper>
          )}
        </AnimatePresence>

        <WelcomeMessage
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ color: '#333', mb: 1 }}>
            Continue sua jornada de aprendizado! Complete os desafios para avançar nas fases.
          </Typography>
        </WelcomeMessage>

        <StyledTypography
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }
          }}>
            Selecione a fase:
          </Typography>
        </StyledTypography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{ width: '100%' }}
          className="phase-carousel"
        >
          <PhaseCarousel decks={decks} quizzes={allQuizzes} />
        </motion.div>
      </ContentContainer>

      {/* Video Card */}
      <AnimatePresence>
        {openMessage && (
          <VideoIntroCard
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleOpenOptions}
            className="video-button"
          >
            <PlayIconWrapper>
              <PlayArrow sx={{ color: 'white', fontSize: 28 }} />
            </PlayIconWrapper>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5650F5' }}>
                Tutorial da Plataforma
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                É seu primeiro acesso? Veja como funciona em poucos minutos
              </Typography>
            </Box>
          </VideoIntroCard>
        )}
      </AnimatePresence>

      {/* Modal de Opções */}
      <Dialog
        open={showOptionsModal}
        onClose={handleCloseOptions}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '24px',
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" sx={{ color: '#5650F5', fontWeight: 'bold', mb: 3 }}>
            Como você prefere conhecer a plataforma?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenModal(true);
                handleCloseOptions();
              }}
              startIcon={<PlayArrow />}
              sx={{
                background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4840e6 30%, #6965e7 90%)'
                },
                py: 1.5
              }}
            >
              Assistir Vídeo Tutorial
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setRunTutorial(true);
                handleCloseOptions();
              }}
              startIcon={<PlayArrow />}
              sx={{
                color: '#5650F5',
                borderColor: '#5650F5',
                py: 1.5
              }}
            >
              Iniciar Tour Guiado
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal do Vídeo */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            boxShadow: '0 24px 38px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            margin: '16px',
            backgroundColor: '#000'
          }
        }}
      >
        <DialogContent sx={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            padding: '1rem', 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              Tutorial da Plataforma
            </Typography>
            <IconButton
              aria-label="Fechar vídeo"
              onClick={() => setOpenModal(false)}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <ReactPlayer
            url="https://youtu.be/E3Sx7Ek-7Vw"
            width="100%"
            height="500px"
            controls
            playing
            onEnded={() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }}
            style={{ maxHeight: '70vh' }}
          />
        </DialogContent>
      </Dialog>
    </HomeWrapper>
  );
};

export default HomePage;

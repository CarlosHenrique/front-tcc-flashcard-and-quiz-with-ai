import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box, Paper, Button, Snackbar, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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

const VideoButton = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  
  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

  // Efeito para mostrar confetti na primeira visita
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      setShowConfetti(true);
      localStorage.setItem('hasVisitedBefore', 'true');
      
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
        >
          <PhaseCarousel decks={decks} quizzes={allQuizzes} />
        </motion.div>
      </ContentContainer>

      {/* Balão de Mensagem */}
      <AnimatePresence>
        {openMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: 80,
              right: 20,
              zIndex: 100,
              maxWidth: '300px'
            }}
          >
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "#5650F5",
                color: "white",
                padding: "15px 20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 10px 20px rgba(86, 80, 245, 0.3)",
                width: { xs: '250px', sm: '300px' }
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: "medium" }}>
                🎥 Veja como a plataforma funciona em poucos minutos!
              </Typography>
              <IconButton
                size="small"
                sx={{ color: "white", marginLeft: 1 }}
                onClick={() => setOpenMessage(false)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de Vídeo */}
      <VideoButton>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Tooltip title="Ver vídeo de apresentação" arrow>
            <Button
              onClick={() => {
                setOpenModal(true);
                setOpenSnackbar(true);
              }}
              variant="contained"
              sx={{
                borderRadius: "50%",
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                boxShadow: "0 10px 20px rgba(86, 80, 245, 0.3)",
                background: "linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)",
                minWidth: 'unset',
                "&:hover": { 
                  background: "linear-gradient(45deg, #4840e6 30%, #6965e7 90%)" 
                },
              }}
            >
              <PlayArrow fontSize="large" />
            </Button>
          </Tooltip>
        </motion.div>
      </VideoButton>

      {/* Modal com o Vídeo */}
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
            margin: '16px'
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
              sx={{ color: 'white' }}
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
              // Mostrar confetti quando o vídeo terminar
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

      {/* Snackbar para reforçar a ação */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={motion.div}
        TransitionProps={{
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
          transition: { type: "spring", stiffness: 300, damping: 25 }
        }}
      >
        <Paper
          elevation={6}
          sx={{
            minWidth: '300px',
            padding: '12px 24px',
            background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(86, 80, 245, 0.2)'
          }}
        >
          <PlayArrow sx={{ color: 'white' }} />
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: '500',
              flex: 1,
              '& span': {
                fontWeight: '600',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9
                }
              }
            }}
          >
            <span onClick={() => setOpenModal(true)}>Clique aqui</span> para assistir o vídeo de apresentação!
          </Typography>
          <IconButton
            size="small"
            onClick={() => setOpenSnackbar(false)}
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Paper>
      </Snackbar>
    </HomeWrapper>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { Dialog, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Celebration, Cancel, Home as HomeIcon, Refresh as RefreshIcon, EmojiEvents, Timer } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- Animações ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// --- Styled Components ---
export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #fff;
    padding: 2rem;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(86, 80, 245, 0.2);
  }
`;

export const StyledDialogTitle = styled(motion.div)`
  text-align: center;
  color: #5650F5;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #5650F5, #7A75F7);
    border-radius: 3px;
  }
`;

export const StyledDialogContent = styled.div`
  text-align: center;
  padding: 1.5rem 1rem;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
`;

const StyledButton = styled(motion.button)`
  background: linear-gradient(45deg, #5650F5 30%, #7A75F7 90%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  margin-top: 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(86, 80, 245, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(86, 80, 245, 0.4);
  }
`;

const ScoreContainer = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 1.5rem 0;
  gap: 16px;
`;

const ScoreItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  justify-content: center; /* Centraliza o conteúdo verticalmente (se houver espaço) */
  padding: 1.5rem 0.5rem; /* Ajustado padding para mais espaço interno */
  border-radius: 15px;
  background: ${props => props.background || 'rgba(86, 80, 245, 0.1)'};
  flex: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  min-width: 120px;
  height: 150px; /* Altura fixa para uniformidade */
  position: relative; /* Para posicionar o ícone no topo */
  overflow: hidden; /* Garante que nada saia do card */
`;

// Ícone flutuante dentro do ScoreItem
const ScoreItemIcon = styled.div`
  position: absolute;
  top: 10px;
  /* left: 50%; */ /* Removido para centralizar usando flexbox principal */
  /* transform: translateX(-50%); */
  font-size: 2.5rem !important; /* Aumenta o tamanho do ícone */
  color: ${props => props.color || '#5650F5'};
`;

const ScoreValue = styled.div`
  font-size: 2.5rem; /* Aumentado o tamanho da fonte para o valor */
  font-weight: bold;
  color: #5650F5;
  margin-top: 1.5rem; /* Ajuste para dar espaço ao ícone */
  /* white-space: nowrap; Removido para permitir quebra se necessário, mas o novo formato é conciso */
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem; /* Espaço entre valor e label */
`;

const TrophyIcon = styled(motion.div)`
  color: gold;
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 3s infinite ease-in-out;
`;

// --- Funções de Formatação Aprimoradas (HH:MM:SS) ---
const formatTimeForDisplay = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60); // Arredonda para baixo

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// --- Componente QuizResultModal ---
const QuizResultModal = ({ open, score, totalQuestions, totalTime, onClose, onRestartQuiz, onBackToHome }) => {
  const [loading, setLoading] = useState(true);
  const isPassed = (score / totalQuestions) >= 0.7;

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (isPassed) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
          });
        }
      }, 1500);
    }
  }, [open, isPassed]);

  const formattedTime = formatTimeForDisplay(totalTime);

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {loading ? (
        <CenteredContainer>
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
            <CircularProgress size={60} thickness={5} sx={{ color: '#5650F5', mb: 2 }} />
          </motion.div>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Calculando resultado...
          </Typography>
        </CenteredContainer>
      ) : (
        <>
          <StyledDialogTitle
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isPassed ? 'Parabéns!' : 'Continue Tentando!'}
          </StyledDialogTitle>

          <StyledDialogContent>
            <CenteredContainer>
              <TrophyIcon>
                {isPassed ? <Celebration style={{ fontSize: '4rem' }} /> : <Cancel style={{ fontSize: '4rem', color: '#E41315' }} />}
              </TrophyIcon>

              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2, color: isPassed ? '#7AA211' : '#E41315' }}>
                {isPassed
                  ? `Você acertou ${score} de ${totalQuestions} questões e passou de fase!`
                  : `Você acertou ${score} de ${totalQuestions} questões. Tente novamente para passar de fase.`}
              </Typography>

              <ScoreContainer>
                <ScoreItem
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  background="#EBF4F6"
                >
                  <ScoreItemIcon>
                    <EmojiEvents style={{ fontSize: '2.5rem' }} /> {/* Ícone no topo */}
                  </ScoreItemIcon>
                  <ScoreValue sx={{ color: '#5650F5' }}>{score}</ScoreValue>
                  <ScoreLabel>Acertos</ScoreLabel>
                </ScoreItem>

                <ScoreItem
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  background="#EBF6E4"
                >
                  <ScoreItemIcon color="#4CAF50">
                    <Timer style={{ fontSize: '2.5rem' }} /> {/* Ícone no topo */}
                  </ScoreItemIcon>
                  <ScoreValue sx={{ color: '#4CAF50' }}>{formattedTime}</ScoreValue>
                  <ScoreLabel>Tempo</ScoreLabel>
                </ScoreItem>
              </ScoreContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <StyledButton
                  onClick={onBackToHome}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HomeIcon /> Voltar para a tela inicial
                </StyledButton>
                {!isPassed && (
                  <StyledButton
                    onClick={onRestartQuiz}
                    sx={{ backgroundColor: '#FF9800 !important', '&:hover': { backgroundColor: '#FFA726 !important' } }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshIcon /> Reiniciar Quiz
                  </StyledButton>
                )}
              </Box>
            </CenteredContainer>
          </StyledDialogContent>
        </>
      )}
    </StyledDialog>
  );
};

export default QuizResultModal;
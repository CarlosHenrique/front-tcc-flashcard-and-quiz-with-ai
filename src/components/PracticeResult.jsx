import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Button, Dialog, Box, Divider } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmojiEvents, Timer, Star, Celebration, SentimentVeryDissatisfied } from '@mui/icons-material';
import confetti from 'canvas-confetti';

// Animações
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

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
  font-family: 'Rowdies', cursive !important;
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
`;

const ScoreItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 15px;
  background: ${props => props.background || 'rgba(86, 80, 245, 0.1)'};
  width: 45%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const ScoreValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #5650F5;
  margin: 0.5rem 0;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const TrophyIcon = styled(motion.div)`
  color: gold;
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 3s infinite ease-in-out;
`;

const SadIcon = styled(motion.div)`
  color: #f44336;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const StarIcon = styled(motion.div)`
  color: gold;
  margin: 0 0.3rem;
`;

const PracticeResultModal = ({ open, onClose, onSaveAndExit, totalScore, timeSpent, passingScore = 70 }) => {
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [stars, setStars] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => {
        const hasPassed = totalScore >= passingScore;
        setPassed(hasPassed);
        
        // Calcular número de estrelas (1-3) com base na pontuação
        const starsEarned = Math.min(3, Math.max(1, Math.floor(totalScore / 30)));
        setStars(starsEarned);
        
        setLoading(false);
        
        // Mostrar confetti se passou
        if (hasPassed) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
          });
        }
      }, 2000);
    }
  }, [open, totalScore, passingScore]);

  const handleRetry = () => {
    onClose();
    navigate('/'); // 🔄 Navega para a HomePage
  };
  
  const handleSaveAndExit = () => {
    if (onSaveAndExit) {
      onSaveAndExit();
    } else {
      onClose();
      navigate('/');
    }
  };

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
            {passed ? "Parabéns!" : "Tente novamente!"}
          </StyledDialogTitle>
          
          <StyledDialogContent>
            <CenteredContainer>
              {passed ? (
                <TrophyIcon>
                  <Celebration style={{ fontSize: '4rem' }} />
                </TrophyIcon>
              ) : (
                <SadIcon
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <SentimentVeryDissatisfied style={{ fontSize: '4rem' }} />
                </SadIcon>
              )}
              
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
                {passed
                  ? "Você completou a fase com sucesso e pode avançar para a próxima etapa!"
                  : "Não foi dessa vez. Continue praticando e tente novamente!"}
              </Typography>
              
              {passed && (
                <StarContainer>
                  {[...Array(3)].map((_, i) => (
                    <StarIcon
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: i < stars ? 1 : 0.5, 
                        rotate: 0,
                        opacity: i < stars ? 1 : 0.3
                      }}
                      transition={{ delay: i * 0.3, duration: 0.5 }}
                    >
                      <Star style={{ fontSize: '2.5rem' }} />
                    </StarIcon>
                  ))}
                </StarContainer>
              )}
              
              <ScoreContainer>
                <ScoreItem
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  background="rgba(86, 80, 245, 0.1)"
                >
                  <EmojiEvents style={{ color: '#5650F5', fontSize: '2rem' }} />
                  <ScoreValue>{totalScore}</ScoreValue>
                  <ScoreLabel>Pontuação</ScoreLabel>
                </ScoreItem>
                
                <ScoreItem
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  background="rgba(76, 175, 80, 0.1)"
                >
                  <Timer style={{ color: '#4CAF50', fontSize: '2rem' }} />
                  <ScoreValue>{timeSpent || "00:00"}</ScoreValue>
                  <ScoreLabel>Tempo</ScoreLabel>
                </ScoreItem>
              </ScoreContainer>
              
              <StyledButton 
                onClick={handleRetry}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {passed ? "Avançar" : "Tentar novamente"}
              </StyledButton>
            </CenteredContainer>
          </StyledDialogContent>
        </>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, mb: 1 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleSaveAndExit}
          startIcon={<EmojiEvents />}
        >
          Salvar e Sair
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRetry}
          startIcon={<Celebration />}
        >
          Concluir
        </Button>
      </Box>
    </StyledDialog>
  );
};

export default PracticeResultModal;

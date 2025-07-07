import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Typography, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Paper, LinearProgress } from '@mui/material';
import { Loop as LoopIcon, ArrowBack, ArrowForward, Info as InfoIcon, Timer, EmojiEvents, Celebration, CheckCircle, Cancel, Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import styled, { css, keyframes } from 'styled-components';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import { useFlashcards } from '../context/FlashcardsContext';
import PracticeResultModal from '../components/PracticeResult';
import { useAuth } from '../context/AuthContext';
import Joyride from 'react-joyride';
import { Toaster, toast } from 'sonner';


// Componentes
const TimerComponent = ({ minutes, seconds }) => {
  return (
    <TimerContainer
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      data-tour="timer-container"
    >
      <Timer style={{ color: '#5650F5', fontSize: '1.5rem' }} />
      <TimerText>
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </TimerText>
    </TimerContainer>
  );
};

// NOVO: Componente de Feedback Visual Flutuante


const ScoreComponent = ({ score }) => {
  return (
    <ScoreContainer
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      data-tour="score-container"
    >
      <EmojiEvents style={{ color: '#5650F5', fontSize: '1.5rem' }} />
      <ScoreText>{score} pts</ScoreText>
    </ScoreContainer>
  );
};

const ActionButtonsComponent = ({ onHomeClick, onResetClick }) => {
  return (
    <>
      <ActionButton
        style={{ top: '160px', left: '20px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onHomeClick}
        data-tour="home-button"
      >
        <HomeIcon />
      </ActionButton>
      
      <ActionButton
        style={{ top: '160px', left: '70px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onResetClick}
        data-tour="reset-button"
      >
        <RefreshIcon />
      </ActionButton>
    </>
  );
};



const FlashCard = ({ 
  card, 
  flipped, 
  onFlip, 
  onMarkQuality, 
  isAnswered, 
  isCorrect, // True se quality >= 3
  onInfoClick,
  attempts = 0,
  revisit = false
}) => {
  // DEBUG: Este console.log é crucial. Verifique o output no navegador.
  useEffect(() => {
  }, [card, flipped, isAnswered, isCorrect, attempts, revisit]);

  return (
    <StyledCard 
      flipped={flipped}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => {
        // Permitir virar o card apenas se não estiver respondido nesta rodada
        // Ou se já respondido, mas a qualidade foi < 3 e ele voltou para revisão
        // A lógica de resetar `isAnswered` para `false` ao reintroduzir para revisão é crucial
        if (!isAnswered) { 
          onFlip();
        } else {
        }
      }}
      style={{ cursor: isAnswered ? 'default' : 'pointer' }}
      data-tour="card"
    >
      <div className="inner-card">
        <div className="front">
          <CardContent>
            <TopSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Certifique-se que card.difficulty está vindo */}
                <Chip 
                  label={card?.difficulty || "Nível"} 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'white',
                    color: '#5650F5'
                  }} 
                />
                {attempts > 0 && ( // Exibe tentativas se houver
                  <Chip 
                    label={`Tentativa ${attempts}`} 
                    color="secondary" 
                    size="small"
                    sx={{ fontWeight: 'bold', ml: 1 }} 
                  />
                )}
                {revisit && ( // Exibe se for para revisão
                  <Chip 
                    label="Revisão" 
                    color="error" 
                    size="small"
                    sx={{ fontWeight: 'bold', ml: 1 }} 
                  />
                )}
                <IconButton 
                  onClick={(e) => { e.stopPropagation(); onInfoClick(); }} 
                  style={{ color: 'white' }}
                >
                  <InfoIcon />
                </IconButton>
              </div>
              <IconButton 
                onClick={(e) => { e.stopPropagation(); onFlip(); }} 
                style={{ color: 'white' }}
              >
                <LoopIcon />
              </IconButton>
            </TopSection>
            <MiddleSection>
              <motion.div
                key={`question-${card?.id}`} // Key para animação de troca
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 1 }}
              >
                {/* ESTE É O CAMPO DA PERGUNTA - VERIFIQUE O card.question */}
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {card?.question || "Pergunta não encontrada. Verifique os dados do card."} 
                </Typography>
              </motion.div>
            </MiddleSection>
            <BottomSection>
              <Typography variant="body2" sx={{ color: 'white', padding: '0 1rem', width: '100%', textAlign: 'center' }}>
                {isAnswered 
                  ? (isCorrect ? "Você acertou!" : "Você precisa revisar.") 
                  : "Clique no card para ver a resposta"}
              </Typography>
            </BottomSection>
          </CardContent>
        </div>
        <div className="back">
          <CardContent>
            <TopSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={card?.difficulty || "Nível"} 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'white',
                    color: '#5650F5'
                  }} 
                />
                {attempts > 0 && (
                  <Chip 
                    label={`Tentativa ${attempts}`} 
                    color="secondary" 
                    size="small"
                    sx={{ fontWeight: 'bold', ml: 1 }} 
                  />
                )}
                {revisit && (
                  <Chip 
                    label="Revisão" 
                    color="error" 
                    size="small"
                    sx={{ fontWeight: 'bold', ml: 1 }} 
                  />
                )}
                <IconButton onClick={onInfoClick} style={{ color: 'white' }}>
                  <InfoIcon />
                </IconButton>
              </div>
              <IconButton 
                onClick={onFlip} 
                style={{ color: 'white' }}
              >
                <LoopIcon />
              </IconButton>
            </TopSection>
            <MiddleSection>
              <motion.div
                key={`answer-${card?.id}`} // Key para animação de troca
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 1 }}
              >
                {/* ESTE É O CAMPO DA RESPOSTA - VERIFIQUE O card.answer */}
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {card?.answer || "Resposta não encontrada. Verifique os dados do card."}
                </Typography>
              </motion.div>
            </MiddleSection>
            <BottomSection>
              {/* Esta seção vai exibir os botões de qualidade se o card não foi respondido,
                  ou o feedback de status se ele JÁ foi respondido */}
              {isAnswered ? (
                <div 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: isCorrect ? 'rgba(122, 162, 17, 0.9)' : 'rgba(228, 19, 21, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {isCorrect ? 'Certo!' : 'Revisar!'}
                </div>
              ) : (
    <>
                  <QualityButton 
                    onClick={() => onMarkQuality(0)} 
                    quality={0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cancel /> Esqueci
                  </QualityButton>
                  <QualityButton 
                    onClick={() => onMarkQuality(1)} // Nova opção "Errei"
                    quality={1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cancel /> Errei
                  </QualityButton>
                  <QualityButton 
                    onClick={() => onMarkQuality(2)} 
                    quality={2}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LoopIcon /> Quase lá
                  </QualityButton>
                  <QualityButton 
                    onClick={() => onMarkQuality(3)} 
                    quality={3}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle /> Com Esforço
                  </QualityButton>
                  <QualityButton 
                    onClick={() => onMarkQuality(4)} 
                    quality={4}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle /> Fácil
                  </QualityButton>
                  <QualityButton 
                    onClick={() => onMarkQuality(5)} 
                    quality={5}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Celebration /> Perfeito!
                  </QualityButton>
                </>
              )}
            </BottomSection>
          </CardContent>
        </div>
      </div>
    </StyledCard>
  );
};

const NavigationControls = ({ onPrev, onNext, currentIndex, totalCards }) => {
  return (
    <NavigationWrapper>
      <NavigationButton 
        onClick={onPrev} 
        disabled={currentIndex === 0}
        whileHover={currentIndex !== 0 ? { scale: 1.1 } : {}}
        whileTap={currentIndex !== 0 ? { scale: 0.9 } : {}}
      >
        <ArrowBack />
      </NavigationButton>
      <NavigationButton 
        onClick={onNext} 
        disabled={currentIndex >= totalCards - 1}
        whileHover={currentIndex < totalCards - 1 ? { scale: 1.1 } : {}}
        whileTap={currentIndex < totalCards - 1 ? { scale: 0.9 } : {}}
      >
        <ArrowForward />
      </NavigationButton>
    </NavigationWrapper>
  );
};

const ExampleDialog = ({ open, onClose, example }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '8px',
          maxWidth: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
        color: 'white',
        borderRadius: '8px 8px 0 0'
      }}>
        Exemplo Prático
      </DialogTitle>
      <DialogContent sx={{ padding: '20px' }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {example || "Nenhum exemplo prático disponível para este cartão."}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const ExitDialog = ({ open, onClose, onExitWithoutSaving }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '8px',
          maxWidth: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#5650F5',
        fontWeight: 'bold'
      }}>
        Sair do estudo
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Deseja sair do estudo? Todo o progresso será perdido.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 16px' }}>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={onExitWithoutSaving} 
          color="error"
          variant="contained"
        >
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Animações
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FlashcardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '10px'};
  height: ${props => props.size || '10px'};
  background-color: ${props => props.color || 'rgba(86, 80, 245, 0.1)'};
  border-radius: 50%;
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '10%'};
  animation: ${float} ${props => props.duration || '3s'} infinite ease-in-out;
  z-index: 0;
`;

const StyledCard = styled(motion.div)`
  width: 90%;
  max-width: 800px;
  height: 400px;
  margin: 2rem 0;
  position: relative;
  perspective: 1500px;
  z-index: 1;

  .inner-card {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-style: preserve-3d;
    ${props => props.flipped ? css`transform: rotateY(180deg);` : css`transform: rotateY(0deg);`}
    box-shadow: 0 15px 35px rgba(86, 80, 245, 0.2);
    border-radius: 20px;
  }

  .front, .back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #5650F5 0%, #7A75F7 100%);
    border-radius: 20px;
    overflow: hidden;
  }

  .back {
    transform: rotateY(180deg);
  }
`;

const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;

const MiddleSection = styled.div`
  flex: 8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    z-index: 0;
  }
`;



const IncorrectButton = styled(motion.button)`
  width: 50%;
  height: 100%;
  border: none;
  background-color: rgba(228, 19, 21, 0.8);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(228, 19, 21, 1);
  }
`;

const CorrectButton = styled(motion.button)`
  width: 50%;
  height: 100%;
  border: none;
  background-color: rgba(122, 162, 17, 0.8);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(122, 162, 17, 1);
  }
`;

const NavigationButton = styled(motion.button)`
  margin: 1rem;
  background: linear-gradient(45deg, #5650F5 30%, #7A75F7 90%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(86, 80, 245, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(86, 80, 245, 0.4);
  }
  
  &:disabled {
    background: linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%);
    cursor: not-allowed;
    transform: scale(1);
    box-shadow: none;
  }
`;

const NavigationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  max-width: 400px;
  margin-top: 1rem;
`;

const ProgressContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProgressStats = styled.div`
  display: flex;
  gap: 15px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  
  .icon {
    color: ${props => props.color || '#5650F5'};
  }
  
  .value {
    font-weight: bold;
    color: ${props => props.color || '#5650F5'};
  }
  
  .label {
    color: #666;
    font-size: 0.8rem;
  }
`;


const SideContainer = styled(motion.div)`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 10;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #5650F5 30%, #7A75F7 90%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(86, 80, 245, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(86, 80, 245, 0.4);
  }
`;

const TimerContainer = styled(motion.div)`
  position: fixed;
  top: 100px;
  right: 20px;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(86, 80, 245, 0.2);
  z-index: 10;
`;

const TimerText = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #5650F5;
  margin-left: 8px;
`;

const ScoreContainer = styled(motion.div)`
  position: fixed;
  top: 100px;
  left: 20px;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(86, 80, 245, 0.2);
  z-index: 10;
`;

const ScoreText = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #5650F5;
  margin-left: 8px;
`;

const ConfettiButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const AnsweredLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  background-color: ${props => props.isCorrect ? 'rgba(122, 162, 17, 0.9)' : 'rgba(228, 19, 21, 0.9)'};
`;

const ActionButton = styled(motion.button)`
  background: white;
  color: #5650F5;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(86, 80, 245, 0.2);
  position: fixed;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(86, 80, 245, 0.3);
  }
`;

const BottomSection = styled.div`
  flex: 1.5;
  display: flex;
  justify-content: space-evenly; /* Altera para distribuir os botões */
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 0 1rem; /* Adiciona padding para os botões */
`;

// Botões para as opções de resposta (Facilidade)
const QualityButton = styled(motion.button)`
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${(props) => props.quality === 5 && css`
    background-color: rgba(122, 162, 17, 0.9); /* Verde - Perfeito! */
    color: white;
    &:hover { background-color: rgba(122, 162, 17, 1); }
  `}
  ${(props) => props.quality === 4 && css`
    background-color: rgba(60, 179, 113, 0.9); /* Verde Claro - Fácil */
    color: white;
    &:hover { background-color: rgba(60, 179, 113, 1); }
  `}
  ${(props) => props.quality === 3 && css`
    background-color: rgba(255, 193, 7, 0.9); /* Amarelo - Com Esforço */
    color: white;
    &:hover { background-color: rgba(255, 193, 7, 1); }
  `}
  ${(props) => props.quality === 2 && css`
    background-color: rgba(255, 99, 71, 0.9); /* Laranja Avermelhado - Quase lá */
    color: white;
    &:hover { background-color: rgba(255, 99, 71, 1); }
  `}
  ${(props) => props.quality === 1 && css`
    background-color: rgba(228, 19, 21, 0.9); /* Vermelho - Errei */
    color: white;
    &:hover { background-color: rgba(228, 19, 21, 1); }
  `}
  ${(props) => props.quality === 0 && css`
    background-color: rgba(139, 0, 0, 0.9); /* Vermelho Escuro - Esqueci */
    color: white;
    &:hover { background-color: rgba(139, 0, 0, 1); }
  `}
`;

const SimpleProgressDisplay = ({ stats }) => { // Remove currentCardIndex, totalCardsInSession se não forem mais usados aqui
  return (
    <ProgressContainer style={{ /* ajuste de estilo se necessário */ }}>
      <ProgressSummary data-tour="progress">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5650F5' }}>
          Progresso Geral: {stats.percentage}%
        </Typography>
        <ProgressStats>
          <StatItem color="#7AA211">
            <CheckCircle className="icon" fontSize="small" />
            <div>
              <span className="value">{stats.correct}</span>
              <span className="label"> dominados</span> {/* Mude para "dominados" */}
            </div>
          </StatItem>
          {stats.revisitCount > 0 && ( // Mantenha só revisitCount para o que falta realmente
            <StatItem color="#FF9800">
              <LoopIcon className="icon" fontSize="small" />
              <div>
                <span className="value">{stats.revisitCount}</span>
                <span className="label"> para revisar</span>
              </div>
            </StatItem>
          )}
          {/* O "incorretos" pode ser menos relevante se eles forem para revisão */}
          {/* {stats.incorrect > 0 && (
            <StatItem color="#E41315">
              <Cancel className="icon" fontSize="small" />
              <div>
                <span className="value">{stats.incorrect}</span>
                <span className="label"> incorretos</span>
              </div>
            </StatItem>
          )} */}
        </ProgressStats>
      </ProgressSummary>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        marginBottom: '5px'
      }}>
        {/* Usar "Objetivo" ou "Dominados" para os 10 cartões */}
        <Typography variant="caption" sx={{ color: '#666' }}>
          Dominados: {stats.correct}/{stats.originalTotal} cartões
        </Typography>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Pontuação da Sessão: {stats.totalPoints} pts
        </Typography>
      </Box>
    </ProgressContainer>
  );
};



const FlashcardsPage = () => {
  const location = useLocation();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, getDeckById, updateCardMetrics, submitResponse, loading, fetchDecks } = useFlashcards();
  const { user, token } = useAuth();

  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); 
  const [flipped, setFlipped] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [cardStates, setCardStates] = useState({}); 
  const [shuffledCardsInSession, setShuffledCardsInSession] = useState([]); 

  const [showResultModal, setShowResultModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0); 
  const [error, setError] = useState(null);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [currentSessionScore, setCurrentSessionScore] = useState(0); 
  const [showConfetti, setShowConfetti] = useState(false);

  const progressLoaded = useRef(false);

  const initialCardIds = useRef([]); 

  const [isStudyCompleted, setIsStudyCompleted] = useState(false);
  const [isFinishingSession, setIsFinishingSession] = useState(false); // Estado para indicar que a sessão está finalizando

  const [showTutorialPaper, setShowTutorialPaper] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  
  // Tutorial steps (mantidos e atualizados para a nova UI/Lógica)
  const tutorialSteps = [
    { target: 'body', content: 'Bem-vindo ao sistema de Flashcards! Aqui você pode praticar e melhorar seu conhecimento através de cartões de estudo interativos.', placement: 'center', disableBeacon: true },
    { target: '[data-tour="card"]', content: 'Este é o flashcard. Ele contém uma pergunta na frente e a resposta no verso. Para começar, clique no cartão para virá-lo e ver a resposta, você também pode ver um exemplo prático clicando no botão de informações.', placement: 'bottom' },
    { target: '[data-tour="timer-container"]', content: 'O timer mostra quanto tempo você está levando para estudar este deck. Use isso para acompanhar seu progresso e melhorar sua velocidade.', placement: 'left' },
    { target: '[data-tour="score-container"]', content: 'Sua pontuação é calculada assim: 10 pontos na primeira tentativa, 7 na segunda, 4 na terceira e 1 ponto nas tentativas seguintes.', placement: 'right' },
    { target: '[data-tour="home-button"]', content: 'Este botão te leva de volta para a página inicial. Use-o quando quiser sair do estudo.', placement: 'left' },
    { target: '[data-tour="reset-button"]', content: 'Este botão reinicia todo o seu progresso. Use-o se quiser começar o estudo novamente do zero.', placement: 'left' },
    { target: '[data-tour="progress"]', content: 'Aqui você vê seu progresso geral: quantos cartões dominou e quantos restam para revisar.', placement: 'top' }, 
    { target: '[data-tour="submit"]', content: 'Quando terminar o estudo ou quiser parar, clique aqui para finalizar a sessão e ver seu resultado.', placement: 'left' },
  ];

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenFlashcardsTutorial');
    if (hasSeenTutorial === 'false' || !hasSeenTutorial) {
      setShowTutorialPaper(true);
      setRunTutorial(false);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenFlashcardsTutorial', 'true');
    setShowTutorialPaper(false);
    setRunTutorial(false);
  };

  const handleStartTutorial = () => {
    setShowTutorialPaper(false);
    setRunTutorial(true);
  };

  useEffect(() => {
    if (!currentDeck || isStudyCompleted) return;

    const timerInterval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds >= 59) {
          setMinutes(prevMinutes => prevMinutes + 1);
          return 0;
        }
        return prevSeconds + 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentDeck, isStudyCompleted]);

  const backgroundParticles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: `${Math.random() * 20 + 5}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    color: `rgba(86, 80, 245, ${Math.random() * 0.2})`,
    duration: `${Math.random() * 5 + 3}s`
  })), []);

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const initializeSessionCards = useCallback((cards) => {
    const initialDeckCards = cards.slice(0, 10);
    initialCardIds.current = initialDeckCards.map(c => c.id);

    const initialStates = initialDeckCards.reduce((acc, card) => {
      acc[card.id] = {
        answered: false,
        isCorrect: null,
        attempts: 0,
        revisit: false,
        reviewQuality: null,
        originalCard: card 
      };
      return acc;
    }, {});

    setCardStates(initialStates);
    setShuffledCardsInSession(shuffleArray(initialCardIds.current));
    setCurrentCardIndex(0); 
    setFlipped(false); 
    setCurrentSessionScore(0); 
  }, []);

  useEffect(() => {
    if (progressLoaded.current) {
        return;
    }

    const fetchDeck = async () => {
      try {
        let deck = null;
        if (location.state && location.state.deck) {
          deck = location.state.deck;
        } else {
          deck = getDeckById(deckId); 
        }

        if (deck) {
          setCurrentDeck(deck);
          if (deck.cards && deck.cards.length > 0) {
            initializeSessionCards(deck.cards);
            progressLoaded.current = true;
          } else {
            setError('Deck encontrado, mas sem cartões para estudo.');
            console.error('Deck vazio ou sem cards para estudo:', deck);
            setTimeout(() => navigate('/'), 3000);
          }
        } else {
          setError('Deck não encontrado.');
          console.error('Deck não encontrado para ID:', deckId);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setError('Erro ao carregar o deck.');
        console.error('Erro ao carregar o deck:', err);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    fetchDeck();
  }, [deckId, navigate, getDeckById, location.state, initializeSessionCards]);

  useEffect(() => {
    const currentCardIdInSession = shuffledCardsInSession[currentCardIndex];
    const currentCardInfo = cardStates[currentCardIdInSession];
    setFlipped(currentCardInfo?.answered || false);
    
    // Removida a lógica de scroll do thumbnail, já que os dots foram removidos.
  }, [currentCardIndex, shuffledCardsInSession, cardStates]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      progressLoaded.current = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Função utilitária para gerar o ISO em horário de Brasília, mas mantendo tipo Date padrão
const getBrazilTimeISOString = () => {
  const now = new Date();
  const offsetMs = -3 * 60 * 60 * 1000; // Brasília = UTC-3
  const brazilTime = new Date(now.getTime() + offsetMs);
  return brazilTime.toISOString();
};

const handleMarkQuality = (quality) => {
  const currentCardId = shuffledCardsInSession[currentCardIndex];
  const currentCardInfo = cardStates[currentCardId];

  if (!currentCardId || !currentCardInfo || (flipped && currentCardInfo.answered)) {
    console.warn("Tentativa de marcar card inválido ou já respondido. Ignorando.");
    return;
  }

  const newAttempts = currentCardInfo.attempts + 1;
  const isConsideredCorrect = quality >= 3; 

  let pointsEarned = 0;
  if (initialCardIds.current.includes(currentCardId)) { 
    if (isConsideredCorrect) {
      if (newAttempts === 1) pointsEarned = 10;
      else if (newAttempts === 2) pointsEarned = 7;
      else if (newAttempts === 3) pointsEarned = 4;
      else pointsEarned = 1;
    } else {
      pointsEarned = 0; 
    }
  }

  const timestamp = new Date().toISOString(); // Armazenar sempre em UTC

  const updatedCardStates = {
    ...cardStates,
    [currentCardId]: {
      ...currentCardInfo,
      answered: true, 
      isCorrect: isConsideredCorrect, 
      attempts: newAttempts, 
      reviewQuality: quality, 
      revisit: quality < 3, 
      timestamp
    }
  };
  setCardStates(updatedCardStates);
  setCurrentSessionScore(prev => prev + pointsEarned);

  // Toast visual
  const toastOptions = { duration: 3000, position: 'bottom-center' };
  const toastMessages = {
    5: 'Perfeito! 🔥',
    4: 'Fácil! ✅',
    3: 'Certo, com esforço. 💡',
    2: 'Quase lá... 🤔',
    1: 'Precisa estudar mais. 😞',
    0: 'Vamos revisar! 🥶'
  };

  const message = toastMessages[quality] || 'Resposta registrada.';
  if (quality >= 3) toast.success(message, toastOptions);
  else if (quality === 2) toast.warning(message, toastOptions);
  else toast.error(message, toastOptions);

  if (quality < 3) {
    setShuffledCardsInSession(prevShuffled => {
      const newShuffled = [...prevShuffled];
      const minOffset = 2;
      const maxOffset = Math.min(newShuffled.length - currentCardIndex - 1, 5); 
      
      let insertIndex = currentCardIndex + minOffset + Math.floor(Math.random() * (maxOffset - minOffset + 1));
      if (insertIndex >= newShuffled.length) insertIndex = newShuffled.length;

      newShuffled.splice(insertIndex, 0, currentCardId); 
      return newShuffled;
    });
  }

  if (currentDeck) {
    updateCardMetrics(currentDeck.id, {
      cardId: currentCardId,
      attempts: newAttempts,
      reviewQuality: quality,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString(),     // Armazena UTC (recomendado)
      lastAttempt: new Date().toISOString()
    });
  }

  setTimeout(() => {
    handleNext();
  }, 2000);
};


const handleNext = () => {
  // Protege contra chamada indevida enquanto finaliza
  if (isFinishingSession) {
    return;
  }

  // Protege contra avanço além do último cartão
  if (currentCardIndex >= shuffledCardsInSession.length - 1) {
    return;
  }

  setCurrentCardIndex(prevIndex => {
    const nextIndex = prevIndex + 1;
    const nextCardId = shuffledCardsInSession[nextIndex];
    const nextCardInfo = cardStates[nextCardId];

    if (nextCardInfo?.revisit) {
      setCardStates(prevStates => ({
        ...prevStates,
        [nextCardId]: {
          ...nextCardInfo,
          answered: false,
          isCorrect: null,
          revisit: false
        }
      }));
    }

    return nextIndex;
  });

  setFlipped(false);
};

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prevIndex => {
        const prevCardId = shuffledCardsInSession[prevIndex - 1];
        setFlipped(cardStates[prevCardId]?.answered || false); 
        return prevIndex - 1;
      });
    } else {
    }
  };

  const handleDotClick = (index) => {
  };

  const progressStats = useMemo(() => {
    if (!currentDeck || Object.keys(cardStates).length === 0 || initialCardIds.current.length === 0) return {
      percentage: 0,
      correct: 0,
      incorrect: 0,
      revisitCount: 0,
      averageScore: 0,
      originalTotal: initialCardIds.current.length || Math.min(currentDeck?.cards?.length || 0, 10)
    };

    const originalCardsCount = initialCardIds.current.length;
    let correctCount = 0; 
    let incorrectCount = 0; 
    let revisitCount = 0; 
    let totalPoints = 0; 
    let answeredOriginalCards = 0; 

    initialCardIds.current.forEach(cardId => {
      const cardInfo = cardStates[cardId];
      if (cardInfo) {
        if (cardInfo.answered) {
          answeredOriginalCards++;
          if (cardInfo.reviewQuality >= 3) {
            correctCount++;
            const attempts = cardInfo.attempts || 1;
            if (attempts === 1) totalPoints += 10;
            else if (attempts === 2) totalPoints += 7;
            else if (attempts === 3) totalPoints += 4;
            else totalPoints += 1;
          } else {
            incorrectCount++;
          }
        }
        if (cardInfo.reviewQuality < 3) {
             revisitCount++;
        }
      }
    });

    const percentage = originalCardsCount > 0 ? Math.round((correctCount / originalCardsCount) * 100) : 0;
    const averageScore = answeredOriginalCards > 0 ? totalPoints / answeredOriginalCards : 0;
    
    return {
      percentage,
      correct: correctCount,
      incorrect: incorrectCount,
      revisitCount,
      averageScore,
      originalAnswered: correctCount, 
      originalTotal: originalCardsCount,
      totalPoints
    };
  }, [cardStates, currentDeck?.cards?.length, initialCardIds]);

  const handleReturnToHome = () => {
    setCardStates({});
    setShuffledCardsInSession([]);
    setCurrentCardIndex(0);
    setFlipped(false);
    setCurrentSessionScore(0);
    setMinutes(0);
    setSeconds(0);
    setIsStudyCompleted(false);
    initialCardIds.current = []; 

    fetchDecks({
      variables: { id: user?.email },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    navigate('/');
  };

  const handleResetProgress = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o progresso desta sessão e começar novamente?')) {
      initializeSessionCards(currentDeck.cards); 
      setCurrentSessionScore(0);
      setMinutes(0);
      setSeconds(0);
      setIsStudyCompleted(false);
      setIsFinishingSession(false); // Reseta o estado de finalização também ao reiniciar
    }
  };

  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleShowExitDialog = () => {
    setShowExitDialog(true);
  };

  const handleCloseExitDialog = () => {
    setShowExitDialog(false);
  };

  

  // Renderização condicional para evitar erros quando a sessão está finalizando
  if (loading || !currentDeck || isFinishingSession) { 
    return (
      <FlashcardsContainer>
        <Header />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          zIndex: 1
        }}>
          {isFinishingSession ? ( // Mensagem específica quando está finalizando
            <>
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
              <Typography variant="body1">
                Finalizando sua sessão de estudo...
              </Typography>
            </>
          ) : error ? (
            <>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Typography variant="body1">
                Redirecionando para a página inicial...
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                Voltar para o Início
              </Button>
            </>
          ) : (
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
              <Typography variant="body1">
                Carregando flashcards...
              </Typography>
            </motion.div>
          )}
        </Box>
      </FlashcardsContainer>
    );
  }

  // NOVO CHECK: Apenas se !isFinishingSession
  if (!isFinishingSession && (shuffledCardsInSession.length === 0 || Object.keys(cardStates).length === 0)) {
      console.warn("Sessão de flashcards não inicializada ou vazia (check principal).");
      
      let errorMessage = "Não foi possível iniciar a sessão de estudo. Verifique se o deck possui cartões.";
      if (!currentDeck) errorMessage = "Carregando deck...";
      else if (!currentDeck.cards || currentDeck.cards.length === 0) errorMessage = "O deck selecionado não possui cartões.";
      else if (shuffledCardsInSession.length === 0) errorMessage = "Erro ao embaralhar cartões para a sessão.";
      else if (Object.keys(cardStates).length === 0) errorMessage = "Erro ao inicializar o estado dos cartões.";

      return (
          <FlashcardsContainer>
              <Header />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                  <Typography variant="h6" color="error">
                      {errorMessage}
                  </Typography>
                  <Button variant="contained" onClick={() => handleReturnToHome()} sx={{ mt: 2 }}>
                      Voltar para Decks
                  </Button>
                  {error && ( 
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Detalhes do Erro: {error.message}
                    </Typography>
                  )}
              </Box>
          </FlashcardsContainer>
      );
  }

  const currentCardId = shuffledCardsInSession[currentCardIndex];
 const currentCard = currentDeck?.cards?.find(card => card?.id === currentCardId);

  const currentCardSessionState = cardStates[currentCardId]; 
  
  // Última linha de defesa: se o card ainda estiver faltando E não estiver finalizando
  if (!isFinishingSession && (!currentCard || !currentCardSessionState || !currentCard.question || !currentCard.answer)) {
    console.error("ERRO CRÍTICO: currentCard ou currentCardSessionState é NULL/UNDEFINED, ou question/answer estão vazios.");
    console.error("currentCardId:", currentCardId);
    console.error("currentCard (objeto):", currentCard);
    console.error("currentCardSessionState:", currentCardSessionState);
    return (
        <FlashcardsContainer>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Typography variant="h6" color="error">
                    Ocorreu um erro inesperado. Por favor, tente recarregar ou voltar ao início.
                </Typography>
                <Button variant="contained" onClick={() => handleReturnToHome()} sx={{ mt: 2 }}>
                  Reiniciar Estudo
                </Button>
            </Box>
        </FlashcardsContainer>
    );
  }

  const formatTime = () => {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const isCurrentCardAnswered = currentCardSessionState.answered;
  const isCurrentCardCorrectForUI = currentCardSessionState.reviewQuality >= 3;

  if (process.env.NODE_ENV === 'development') {
  }

  // A FUNÇÃO handleSubmitResponses estava declarada duas vezes.
  // Esta é a única versão que deve permanecer.
  const handleSubmitResponses = async () => {

    setShowConfetti(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
    setTimeout(() => { 
      setShowConfetti(false);
    }, 3000);

    setIsStudyCompleted(true); 

    const finalScore = currentSessionScore; 

    const finalCardMetrics = initialCardIds.current.map(cardId => {
      const cardProgress = cardStates[cardId];
      if (cardProgress && cardProgress.attempts > 0) { 
        return {
          cardId: cardId,
          attempts: cardProgress.attempts,
          reviewQuality: cardProgress.reviewQuality || 0, 
          easeFactor: 2.5, 
          nextReviewDate: new Date().toISOString(), 
          lastAttempt: cardProgress.timestamp || new Date().toISOString()
        };
      }
      return null; 
    }).filter(Boolean); 

    const finalResponse = {
      userId: user?.email,
      deckId: currentDeck.id,
      selectedCardsIds: finalCardMetrics.map(m => m.cardId), 
   totalSessionScore: finalScore,
      cardMetrics: finalCardMetrics,
      date: new Date().toISOString()
    };

   try {
  const response = await submitResponse(finalResponse);

  if (!response) {
    throw new Error('Resposta do servidor está indefinida.');
  }

  setTotalScore(finalScore);
  setShowResultModal(true);
} catch (error) {
  console.error('Erro ao enviar resposta final:', error);
  toast.error("Erro ao enviar suas respostas. Tente novamente.");
  setTotalScore(finalScore);
  setShowResultModal(true);
} finally {
    }
  };

  return (
    <FlashcardsContainer>
      <Header />
      {/* Tutorial Joyride */}
      <Joyride
        steps={tutorialSteps}
        run={runTutorial}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#5650F5',
            textColor: '#222',
            backgroundColor: '#fff',
          },
        }}
        locale={{
          back: 'Voltar',
          close: 'Fechar',
          last: 'Finalizar',
          next: 'Próximo',
          skip: 'Pular',
        }}
        callback={data => {
          if (data.status === 'finished' || data.status === 'skipped') {
            handleTutorialComplete();
          }
        }}
      />

      {/* Paper de Tutorial */}
      <AnimatePresence>
        {showTutorialPaper && (
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
                Bem-vindo aos Flashcards!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Vamos te mostrar como usar o sistema de flashcards para melhorar seus estudos.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleTutorialComplete}
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

      {/* Timer */}
      <TimerComponent minutes={minutes} seconds={seconds} />

      {/* Pontuação */}
      <ScoreComponent score={currentSessionScore} /> 

      {/* Botões de ação */}
      <ActionButtonsComponent
        onHomeClick={handleShowExitDialog}
        onResetClick={handleResetProgress}
      />

      {/* Título do deck */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '1rem', textAlign: 'center', zIndex: 1 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5650F5' }}>
          {currentDeck.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Rodada: Cartão {currentCardIndex + 1} de {shuffledCardsInSession.length} na fila
        </Typography>
      </motion.div>

      {/* Cartão (somente renderiza se NÃO estiver finalizando a sessão) */}
      {!isFinishingSession && currentCard && currentCardSessionState && (
        <FlashCard
          card={currentCard}
          flipped={flipped}
          onFlip={() => setFlipped(prev => !prev)}
          onMarkQuality={handleMarkQuality}
          isAnswered={isCurrentCardAnswered} 
          isCorrect={isCurrentCardCorrectForUI} 
          onInfoClick={() => setDialogOpen(true)}
          attempts={currentCardSessionState.attempts || 0}
          revisit={currentCardSessionState.revisit || false}
        />
      )}

      {/* NOVO: Componente de progresso simplificado (renderiza sempre, pois é informação geral) */}
      <SimpleProgressDisplay 
        stats={progressStats}
      />
      
      {/* Container lateral para o botão de conclusão */}
      <SideContainer
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div data-tour="submit">
         {currentCardIndex === shuffledCardsInSession.length - 1 && (
  <Box sx={{ mt: 2 }}>
    <SubmitButton onClick={handleSubmitResponses}>
      <Celebration /> Finalizar Estudo
    </SubmitButton>
  </Box>
)}
        </div>
      </SideContainer>

      {/* Controles de navegação (somente se NÃO estiver finalizando a sessão) */}
      {!isFinishingSession && ( 
        <NavigationControls
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={currentCardIndex}
          totalCardsInSession={shuffledCardsInSession.length} 
        />
      )}
      
      {/* NOVO: Toaster do Sonner (renderiza sempre) */}
      <Toaster richColors /> 

      <PracticeResultModal
        open={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setIsFinishingSession(false); // Reseta o estado de finalização
          handleReturnToHome(); // Agora o reset total acontece aqui
        }}
        totalScore={totalScore}
        timeSpent={formatTime()}
      />

      <ExampleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        example={currentCard?.practiceExample}
      />

      <ExitDialog
        open={showExitDialog}
        onClose={handleCloseExitDialog}
        onExitWithoutSaving={() => handleReturnToHome()}
      />
    </FlashcardsContainer>
  );
};

export default FlashcardsPage;
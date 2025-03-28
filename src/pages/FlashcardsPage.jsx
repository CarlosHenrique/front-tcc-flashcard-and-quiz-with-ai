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

// Componentes
const TimerComponent = ({ minutes, seconds }) => {
  return (
    <TimerContainer
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Timer style={{ color: '#5650F5', fontSize: '1.5rem' }} />
      <TimerText>
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </TimerText>
    </TimerContainer>
  );
};

const ScoreComponent = ({ score }) => {
  return (
    <ScoreContainer
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
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
      >
        <HomeIcon />
      </ActionButton>
      
      <ActionButton
        style={{ top: '160px', left: '70px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onResetClick}
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
  onMarkCorrect, 
  onMarkIncorrect, 
  isAnswered, 
  isCorrect,
  onInfoClick,
  attempts = 0,
  revisit = false
}) => {
  return (
    <StyledCard 
      flipped={flipped}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => {
        // Só permite virar se o cartão não foi respondido ainda
        if (!isAnswered) {
          onFlip();
        }
      }}
      style={{ cursor: isAnswered ? 'default' : 'pointer' }}
    >
      <div className="inner-card">
        <div className="front">
          <CardContent>
            <TopSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={card.difficulty} 
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
                    sx={{ 
                      fontWeight: 'bold',
                      ml: 1
                    }} 
                  />
                )}
                {revisit && (
                  <Chip 
                    label="Revisão" 
                    color="error" 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      ml: 1
                    }} 
                  />
                )}
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique se propague para o cartão
                    onInfoClick();
                  }} 
                  style={{ color: 'white' }}
                >
                  <InfoIcon />
                </IconButton>
              </div>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation(); // Impede que o clique se propague para o cartão
                  onFlip();
                }} 
                style={{ color: 'white' }}
              >
                <LoopIcon />
              </IconButton>
            </TopSection>
            <MiddleSection>
              <motion.div
                key={`question-${card.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {card.question}
                </Typography>
              </motion.div>
            </MiddleSection>
            <BottomSection>
              <Typography variant="body2" sx={{ color: 'white', padding: '0 1rem', width: '100%', textAlign: 'center' }}>
                {isAnswered 
                  ? "Este cartão já foi respondido" 
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
                  label={card.difficulty} 
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
                    sx={{ 
                      fontWeight: 'bold',
                      ml: 1
                    }} 
                  />
                )}
                {revisit && (
                  <Chip 
                    label="Revisão" 
                    color="error" 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      ml: 1
                    }} 
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
                key={`answer-${card.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {card.answer}
                </Typography>
              </motion.div>
            </MiddleSection>
            <BottomSection>
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
                  {isCorrect ? (
                    <>
                      <CheckCircle style={{ marginRight: '8px' }} /> Você respondeu: Correto
                    </>
                  ) : (
                    <>
                      <Cancel style={{ marginRight: '8px' }} /> Você respondeu: Incorreto
                    </>
                  )}
                </div>
              ) : (
                <>
                  <IncorrectButton 
                    onClick={onMarkIncorrect}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cancel /> Incorreto
                  </IncorrectButton>
                  <CorrectButton 
                    onClick={onMarkCorrect}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle /> Correto
                  </CorrectButton>
                </>
              )}
            </BottomSection>
          </CardContent>
        </div>
      </div>
    </StyledCard>
  );
};

const ProgressBar = ({ stats, progress, currentIndex, onDotClick }) => {
  return (
    <ProgressContainer>
      <ProgressSummary>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5650F5' }}>
          Progresso: {stats.percentage}%
        </Typography>
        <ProgressStats>
          <StatItem color="#7AA211">
            <CheckCircle className="icon" fontSize="small" />
            <div>
              <span className="value">{stats.correct}</span>
              <span className="label"> corretos</span>
            </div>
          </StatItem>
          {stats.incorrect > 0 && (
            <StatItem color="#E41315">
              <Cancel className="icon" fontSize="small" />
              <div>
                <span className="value">{stats.incorrect}</span>
                <span className="label"> incorretos</span>
              </div>
            </StatItem>
          )}
          {stats.revisitCount > 0 && (
            <StatItem color="#FF9800">
              <LoopIcon className="icon" fontSize="small" />
              <div>
                <span className="value">{stats.revisitCount}</span>
                <span className="label"> para revisar</span>
              </div>
            </StatItem>
          )}
        </ProgressStats>
      </ProgressSummary>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 10px',
        marginBottom: '5px'
      }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Cartões: {stats.correct}/{stats.originalTotal} corretos
        </Typography>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Pontuação total: {stats.totalPoints} pts
        </Typography>
      </Box>
      
      <CardThumbnails>
        {progress && progress.slice(0, stats.originalTotal).map((p, index) => {
          return (
            <CardThumbnail
              key={`card-${index}`}
              isCorrect={p?.isCorrect}
              isCurrent={index === currentIndex}
              isRevisit={p?.revisit}
              attempts={p?.attempts || 0}
              onClick={() => onDotClick(index)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                backgroundColor: p?.answered 
                  ? (p?.isCorrect ? 'rgba(122, 162, 17, 0.1)' : 'rgba(228, 19, 21, 0.1)') 
                  : p?.revisit ? 'rgba(255, 152, 0, 0.1)' : 'white'
              }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              <span className="number">{index + 1}</span>
              {p?.answered && (
                <div className="status">
                  {p?.isCorrect ? '✓' : '✗'}
                </div>
              )}
              {p?.revisit && (
                <div className="revisit-indicator">R</div>
              )}
              {p?.attempts > 0 && (
                <div className="attempts-indicator">{p?.attempts}</div>
              )}
            </CardThumbnail>
          );
        })}
      </CardThumbnails>
    </ProgressContainer>
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

const BottomSection = styled.div`
  flex: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
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

const CardThumbnails = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 5px 0;
  scrollbar-width: thin;
  scrollbar-color: #5650F5 #f0f0f0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #5650F5;
    border-radius: 10px;
  }
`;

const CardThumbnail = styled(motion.div)`
  min-width: 80px;
  height: 50px;
  border-radius: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: ${props => props.isCurrent 
    ? '0 0 0 3px #5650F5, 0 4px 10px rgba(86, 80, 245, 0.3)' 
    : '0 2px 5px rgba(0, 0, 0, 0.1)'
  };
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    background-color: ${props => 
      props.isCorrect === true ? 'rgba(122, 162, 17, 0.2)' : 
      props.isCorrect === false ? 'rgba(228, 19, 21, 0.2)' : 
      props.isRevisit ? 'rgba(255, 152, 0, 0.2)' :
      'transparent'
    };
  }
  
  .number {
    font-weight: bold;
    color: #333;
    z-index: 1;
  }
  
  .status {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => 
      props.isCorrect === true ? '#7AA211' : 
      props.isCorrect === false ? '#E41315' : 
      'transparent'
    };
    color: white;
    font-size: 12px;
    z-index: 2;
  }
  
  .revisit-indicator {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FF9800;
    color: white;
    font-size: 10px;
    font-weight: bold;
    z-index: 2;
  }
  
  .attempts-indicator {
    position: absolute;
    bottom: -5px;
    left: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #5650F5;
    color: white;
    font-size: 10px;
    font-weight: bold;
    z-index: 2;
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

const FlashcardsPage = () => {
  
  
  const location = useLocation();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, getDeckById, updateCardMetrics, submitResponse, loading, fetchDecks } = useFlashcards();
  const { user, token } = useAuth();
  
  // Estado para armazenar o deck atual
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progress, setProgress] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState(null);
  
  // Estados para o timer e pontuação - simplificados
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Referência para controlar se o progresso já foi carregado
  const progressLoaded = useRef(false);
  
  // Novo estado para controlar se o estudo está concluído
  const [isStudyCompleted, setIsStudyCompleted] = useState(false);
  
  // Modificar o useEffect do timer
  useEffect(() => {
    // Não iniciar o timer se o estudo estiver concluído
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
  
  // Gerar partículas de fundo aleatórias - Memoizado para evitar re-renderizações
  const backgroundParticles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: `${Math.random() * 20 + 5}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    color: `rgba(86, 80, 245, ${Math.random() * 0.2})`,
    duration: `${Math.random() * 5 + 3}s`
  })), []);
  
  // Buscar o deck pelo ID quando o componente for montado
  useEffect(() => {
    if (progressLoaded.current) return;
    
    const fetchDeck = async () => {
      try {
        let deck = null;
        
        // Primeiro, tenta usar o deck do location.state se disponível
        if (location.state && location.state.deck) {
          deck = location.state.deck;
        } else {
          // Se não estiver disponível, busca o deck pelo ID
          deck = getDeckById(deckId);
        }
        
        if (deck) {
          setCurrentDeck(deck);
          
          // Inicializa o progresso diretamente
          initializeProgress(deck);
          
          progressLoaded.current = true;
        } else {
          setError('Deck não encontrado');
          setTimeout(() => navigate('/'), 3000); // Redireciona para a home após 3 segundos
        }
      } catch (err) {
        setError('Erro ao carregar o deck');
        console.error('Erro ao carregar o deck:', err);
        setTimeout(() => navigate('/'), 3000); // Redireciona para a home após 3 segundos
      }
    };
    
    // Função para inicializar o progresso
    const initializeProgress = (deck) => {
      const initialProgress = deck.cards.map(() => ({
        status: 'pending',
        answered: false,
        isCorrect: null,
        attempts: 0,
        revisit: false
      }));
      
     
      setProgress(initialProgress);
    };
    
    fetchDeck();
  }, [deckId, navigate, getDeckById, location.state]);

  // Efeito para atualizar o estado flipped quando o usuário navega entre os cartões
  useEffect(() => {
    // Verificar se o cartão atual já foi respondido
    const isCurrentCardAnswered = progress && progress[currentCardIndex]?.answered || false;
    
    // Se o cartão já foi respondido, mantém virado, caso contrário, desvirado
    setFlipped(isCurrentCardAnswered);
    
    console.log('Atualizando estado flipped para cartão', currentCardIndex, 'respondido:', isCurrentCardAnswered);
  }, [currentCardIndex, progress]);

  // Efeito para limpar o estado quando o componente é desmontado
  useEffect(() => {
    // Função para limpar o estado quando o usuário sai da página sem usar os botões
    const handleBeforeUnload = (event) => {
      // Resetar a flag de progresso carregado
      progressLoaded.current = false;
      
      console.log('Componente FlashcardsPage desmontado, estado limpo');
    };
    
    // Adicionar o evento beforeunload para resetar o progresso quando o usuário fecha a página
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      // Remover o evento beforeunload
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      console.log('Componente FlashcardsPage desmontado, estado limpo');
    };
  }, []);

  // Modificar a função handleSubmitResponses
  const handleSubmitResponses = async () => {
    // Mostrar confetti para celebrar a conclusão
    setShowConfetti(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Marcar o estudo como concluído
    setIsStudyCompleted(true);
    
    // Usar o progresso atual para montar o objeto final
    const finalResponse = {
      userId: user?.email,
      deckId: currentDeck.id,
      selectedCardsIds: currentDeck.cards.slice(0, 10).map(card => card.id),
      score: progressStats.totalPoints,
      cardMetrics: currentDeck.cards.slice(0, 10).map((card, index) => {
        const cardProgress = progress[index];
        return {
          cardId: card.id,
          attempts: cardProgress?.attempts || 0,
          score: cardProgress?.isCorrect ? 
            (cardProgress.attempts === 1 ? 10 : 
             cardProgress.attempts === 2 ? 7 : 
             cardProgress.attempts === 3 ? 4 : 1) : 0,
          lastAttempt: new Date().toISOString(),
          nextReviewDate: new Date(Date.now() + (cardProgress?.attempts || 1) * 24 * 60 * 60 * 1000).toISOString()
        };
      }),
      date: new Date().toISOString()
    };
    
    try {
      console.log('Enviando respostas para o servidor...', finalResponse);
      // Submeter as respostas para o servidor
      const response = await submitResponse(finalResponse);
      console.log('Resposta enviada com sucesso:', response);
      
      // Atualizar a pontuação total e mostrar o modal de resultados
      setTotalScore(finalResponse.score);
      setShowResultModal(true);
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
      // Mesmo com erro, mostramos o modal de resultados
      setTotalScore(finalResponse.score);
      setShowResultModal(true);
    }
    
    // Limpar o confetti após alguns segundos
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  // Função para virar o cartão
  const handleFlipCard = () => {
    // Verificar se o cartão atual já foi respondido
    const isCurrentCardAnswered = progress && progress[currentCardIndex]?.answered || false;
    
    if (isCurrentCardAnswered) return; // Não permite virar cartões já respondidos
    setFlipped(prev => !prev);
  };
  
  // Função para marcar cartão como correto
  const handleMarkCorrect = () => {
    // Verificar se o cartão atual já foi respondido
    const isCurrentCardAnswered = progress && progress[currentCardIndex]?.answered || false;
    
    // Só permite marcar como correto se o cartão estiver virado e ainda não tiver sido respondido
    if (!flipped || isCurrentCardAnswered) return;
    
    console.log('Marcando cartão como correto:', currentCardIndex);
    
    // Incrementa o número de tentativas
    const currentAttempts = (progress[currentCardIndex]?.attempts || 0) + 1;
    
    // Calcula a pontuação com base no número de tentativas
    let pointsEarned = 1; // Valor padrão para 4 ou mais tentativas
    if (currentAttempts === 1) {
      pointsEarned = 10; // Primeira tentativa
    } else if (currentAttempts === 2) {
      pointsEarned = 7;  // Segunda tentativa
    } else if (currentAttempts === 3) {
      pointsEarned = 4;  // Terceira tentativa
    }
    
    console.log(`Acerto na tentativa ${currentAttempts}: ${pointsEarned} pontos`);
    
    // Atualiza o progresso
    const updatedProgress = [...progress];
    updatedProgress[currentCardIndex] = {
      ...updatedProgress[currentCardIndex],
      answered: true,
      isCorrect: true,
      attempts: currentAttempts,
      revisit: false, // Desmarca para revisitar, pois foi respondido corretamente
      timestamp: new Date().toISOString()
    };
    
    setProgress(updatedProgress);
    
    // Atualiza a pontuação com base no número de tentativas
    setCurrentScore(prev => prev + pointsEarned);
    
    // Atualiza as métricas do cartão no contexto
    if (currentDeck && currentCard) {
      // Chama a função updateCardMetrics do contexto
      updateCardMetrics(
        currentDeck.id,
        currentCard.id,
        true, // correto
        currentAttempts // número de tentativas
      );
      
      console.log(`Métricas atualizadas para cartão ${currentCard.id} (correto após ${currentAttempts} tentativas)`);
    }
    
    // Avança para o próximo cartão após um breve delay
    setTimeout(() => {
      handleNext();
    }, 500);
  };
  
  // Função para marcar cartão como incorreto
  const handleMarkIncorrect = () => {
    // Verificar se o cartão atual já foi respondido
    const isCurrentCardAnswered = progress && progress[currentCardIndex]?.answered || false;
    
    // Só permite marcar como incorreto se o cartão estiver virado e ainda não tiver sido respondido
    if (!flipped || isCurrentCardAnswered) return;
    
    console.log('Marcando cartão como incorreto:', currentCardIndex);
    
    // Incrementa o número de tentativas
    const currentAttempts = (progress[currentCardIndex]?.attempts || 0) + 1;
    
    // Atualiza o progresso
    const updatedProgress = [...progress];
    updatedProgress[currentCardIndex] = {
      ...updatedProgress[currentCardIndex],
      // Marcamos como respondido, mesmo sendo incorreto
      answered: true,
      isCorrect: false,
      attempts: currentAttempts,
      revisit: true, // Marca para revisitar este cartão posteriormente
      timestamp: new Date().toISOString()
    };
    
    setProgress(updatedProgress);
    
    // Atualiza as métricas do cartão no contexto
    if (currentDeck && currentCard) {
      // Chama a função updateCardMetrics do contexto
      updateCardMetrics(
        currentDeck.id,
        currentCard.id,
        false, // incorreto
        currentAttempts // número de tentativas
      );
      
      console.log(`Métricas atualizadas para cartão ${currentCard.id} (incorreto após ${currentAttempts} tentativas)`);
    }
    
    // Avança para o próximo cartão após um breve delay
    setTimeout(() => {
      handleNext();
    }, 500);
  };
  
  // Função para avançar para o próximo cartão
  const handleNext = () => {
    const nextIndex = currentCardIndex + 1;
    const totalCards = currentDeck?.cards?.length || 0;
    
    // Verifica se todos os cartões foram respondidos corretamente
    const allCardsAnsweredCorrectly = progress.every(p => p.answered && p.isCorrect);
    
    // Verifica se há cartões para revisitar
    const hasCardsToRevisit = progress.some(p => p.revisit === true);
    
    // Se chegamos ao final do deck e todos os cartões foram respondidos corretamente, mostramos o resultado
    if (nextIndex >= totalCards && allCardsAnsweredCorrectly) {
      handleSubmitResponses();
      return;
    }
    
    // Se chegamos ao final do deck mas ainda há cartões para revisitar
    if (nextIndex >= totalCards && hasCardsToRevisit) {
      // Encontra o primeiro cartão que precisa ser revisitado
      const revisitIndex = progress.findIndex(p => p.revisit === true);
      
      if (revisitIndex !== -1) {
        console.log(`Revisitando cartão ${revisitIndex} que foi marcado para revisão`);
        setCurrentCardIndex(revisitIndex);
        
        // Resetamos o estado do cartão para permitir nova resposta
        const updatedProgress = [...progress];
        updatedProgress[revisitIndex] = {
          ...updatedProgress[revisitIndex],
          // Mantemos o cartão como não respondido para permitir nova resposta
          answered: false,
          // Mantemos as tentativas anteriores
          // Mantemos marcado para revisão até que seja respondido corretamente
        };
        
        setProgress(updatedProgress);
        setFlipped(false); // Garantimos que o cartão comece desvirado
        
        return;
      }
    }
    
    // Se chegamos ao final do deck mas ainda há cartões não respondidos
    if (nextIndex >= totalCards) {
      // Encontra o primeiro cartão não respondido
      const unansweredIndex = progress.findIndex(p => !p.answered);
      
      if (unansweredIndex !== -1) {
        console.log(`Avançando para o cartão não respondido ${unansweredIndex}`);
        setCurrentCardIndex(unansweredIndex);
        return;
      } else {
        // Se todos os cartões foram respondidos, mostra o resultado
        handleSubmitResponses();
        return;
      }
    }
    
    console.log('Avançando para o cartão:', nextIndex, 'de', totalCards);
    
    // Atualizamos o índice do cartão atual
    setCurrentCardIndex(nextIndex);
    
    // O useEffect cuidará de atualizar o estado flipped com base no progresso
  };
  
  // Função para voltar para o cartão anterior
  const handlePrev = () => {
    if (currentCardIndex === 0) return; // Evita voltar antes do primeiro cartão
    
    const prevIndex = currentCardIndex - 1;
    
    console.log('Voltando para o cartão:', prevIndex);
    
    // Atualizamos o índice do cartão atual
    setCurrentCardIndex(prevIndex);
    
    // O useEffect cuidará de atualizar o estado flipped com base no progresso
  };
  
  // Função para clicar em um ponto de navegação
  const handleDotClick = (index) => {
    if (index === currentCardIndex) return; // Evita re-renderização desnecessária
    
    console.log('Clicando no ponto:', index);
    
    // Atualizamos o índice do cartão atual
    setCurrentCardIndex(index);
    
    // O useEffect cuidará de atualizar o estado flipped com base no progresso
  };
  
  // Calcular estatísticas de progresso - Memoizado para evitar re-renderizações
  const progressStats = useMemo(() => {
    if (!progress || progress.length === 0) return { 
      percentage: 0, 
      correct: 0, 
      incorrect: 0,
      revisitCount: 0,
      averageScore: 0
    };
    
    // Contagem de cartões originais (primeiros 10)
    const originalCardsCount = Math.min(currentDeck?.cards?.length || 0, 10);
    
    // Cartões respondidos corretamente (apenas dos originais)
    const correctCount = progress
      .slice(0, originalCardsCount)
      .filter(p => p?.answered && p?.isCorrect === true)
      .length;
    
    // Cartões marcados para revisão (apenas dos originais)
    const revisitCount = progress
      .slice(0, originalCardsCount)
      .filter(p => p?.revisit === true)
      .length;
    
    // Cartões respondidos incorretamente (e não marcados para revisão)
    const incorrectCount = progress
      .slice(0, originalCardsCount)
      .filter(p => p?.answered && p?.isCorrect === false)
      .length;
    
    // Total de cartões respondidos (excluindo os que estão para revisão)
    const originalAnsweredCount = correctCount + incorrectCount;
    
    // Cálculo da pontuação total - apenas para cartões originais respondidos corretamente
    let totalPoints = 0;
    progress.slice(0, originalCardsCount).forEach(p => {
      if (p?.answered && p?.isCorrect) {
        const attempts = p?.attempts || 1;
        if (attempts === 1) totalPoints += 10;
        else if (attempts === 2) totalPoints += 7;
        else if (attempts === 3) totalPoints += 4;
        else totalPoints += 1;
      }
    });
    
    const averageScore = originalAnsweredCount > 0 
      ? totalPoints / originalAnsweredCount 
      : 0;
    
    // Cálculo da porcentagem de progresso
    const percentage = Math.round((correctCount / originalCardsCount) * 100);
    
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
  }, [progress, currentDeck?.cards?.length]);

  // Modificar o handleReturnToHome para resetar o estado de conclusão
  const handleReturnToHome = () => {
    // Resetar estados
    setProgress([]);
    setCurrentCardIndex(0);
    setFlipped(false);
    setCurrentScore(0);
    setMinutes(0);
    setSeconds(0);
    setIsStudyCompleted(false);
    
    // Recarregar dados do backend antes de navegar
    fetchDecks({
      variables: { id: user?.email },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    // Navegar para a página inicial
    navigate('/');
  };

  // Modificar o handleResetProgress para resetar o estado de conclusão
  const handleResetProgress = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o progresso e começar novamente?')) {
      const initialProgress = currentDeck.cards.map(() => ({
        status: 'pending',
        answered: false,
        isCorrect: null,
        attempts: 0,
        revisit: false
      }));
      
      setProgress(initialProgress);
      setCurrentCardIndex(0);
      setFlipped(false);
      setCurrentScore(0);
      setMinutes(0);
      setSeconds(0);
      setIsStudyCompleted(false);
      
      console.log('Progresso resetado, começando novamente');
    }
  };
  
  // Função para mostrar diálogo de confirmação para sair
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const handleShowExitDialog = () => {
    setShowExitDialog(true);
  };

  const handleCloseExitDialog = () => {
    setShowExitDialog(false);
  };

  // Se estiver carregando ou se o deck não foi encontrado, mostra um indicador de carregamento
  if (loading || !currentDeck) {
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
          {error ? (
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
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
            </motion.div>
          )}
          <Typography variant="body1">
            {error ? 'Redirecionando para a página inicial...' : 'Carregando flashcards...'}
          </Typography>
        </Box>
      </FlashcardsContainer>
    );
  }

  const currentCard = currentDeck?.cards?.[currentCardIndex];
  
  // Formatar o tempo para exibição
  const formatTime = () => {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Verificar se o cartão atual já foi respondido
  const isCurrentCardAnswered = progress && progress[currentCardIndex]?.answered || false;
  const isCurrentCardCorrect = progress && progress[currentCardIndex]?.isCorrect || false;

  // Log para depuração - apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('Renderizando com progresso:', progress);
    console.log('Cartão atual:', currentCardIndex, 'respondido:', isCurrentCardAnswered, 'correto:', isCurrentCardCorrect);
    console.log('Estatísticas:', progressStats);
  }

  return (
    <FlashcardsContainer>
      <Header />
      
      {/* Partículas de fundo */}
      {backgroundParticles.map(particle => (
        <BackgroundParticle 
          key={particle.id}
          size={particle.size}
          top={particle.top}
          left={particle.left}
          color={particle.color}
          duration={particle.duration}
        />
      ))}
      
      {/* Timer - simplificado, apenas para exibição */}
      <TimerComponent minutes={minutes} seconds={seconds} />
      
      {/* Pontuação */}
      <ScoreComponent score={currentScore} />
      
      {/* Botões de ação */}
      <ActionButtonsComponent 
        onHomeClick={handleShowExitDialog} 
        onResetClick={handleResetProgress} 
      />
      
      {/* Container lateral para o botão de conclusão */}
      {progress.every(p => p.answered && p.isCorrect) && !progress.some(p => p.revisit) && (
        <SideContainer
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SubmitButton 
            onClick={handleSubmitResponses}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Celebration />
            Concluir Estudo
          </SubmitButton>
        </SideContainer>
      )}
      
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
          Cartão {currentCardIndex + 1} de {currentDeck.cards.length}
        </Typography>
      </motion.div>
      
      {/* Cartão */}
      <FlashCard 
        card={currentCard}
        flipped={flipped}
        onFlip={handleFlipCard}
        onMarkCorrect={handleMarkCorrect}
        onMarkIncorrect={handleMarkIncorrect}
        isAnswered={isCurrentCardAnswered}
        isCorrect={isCurrentCardCorrect}
        onInfoClick={() => setDialogOpen(true)}
        attempts={progress && progress[currentCardIndex]?.attempts || 0}
        revisit={progress && progress[currentCardIndex]?.revisit || false}
      />
      
      {/* Barra de progresso */}
      <ProgressBar 
        stats={progressStats}
        progress={progress}
        currentIndex={currentCardIndex}
        onDotClick={handleDotClick}
      />
      
      {/* Controles de navegação */}
      <NavigationControls 
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentCardIndex}
        totalCards={currentDeck.cards.length}
      />
      
      <PracticeResultModal 
        open={showResultModal} 
        onClose={() => {
          setShowResultModal(false);
          handleReturnToHome(); // Não salva o progresso por padrão após concluir
        }}
        totalScore={totalScore} 
        timeSpent={formatTime()}
      />
      
      {/* Diálogo de exemplo prático */}
      <ExampleDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        example={currentCard?.practiceExample}
      />
      
      {/* Diálogo de confirmação para sair */}
      <ExitDialog 
        open={showExitDialog}
        onClose={handleCloseExitDialog}
        onExitWithoutSaving={() => handleReturnToHome()}
      />
    </FlashcardsContainer>
  );
};

export default FlashcardsPage;

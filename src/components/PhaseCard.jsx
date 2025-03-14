import React, { useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { Card, Typography, Box, Tooltip, IconButton, CardContent, Button, Dialog, DialogContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, PlayArrow, Close, School, QuestionAnswer, VideoLibrary, Info } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { useFlashcards } from '../context/FlashcardsContext';

// Estilos
const StyledCard = styled(motion(Card))`
  width: 300px;
  height: 420px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(86, 80, 245, 0.2);
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 280px;
    height: 400px;
  }
  
  @media (min-width: 1200px) {
    width: 320px;
    height: 450px;
  }
`;

const CardImage = styled.div`
  height: 140px;
  background-image: ${props => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(to top, white, transparent);
  }
  
  @media (min-width: 1200px) {
    height: 160px;
  }
`;

const CardContentWrapper = styled(CardContent)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px !important;
  position: relative;
  
  @media (min-width: 1200px) {
    padding: 20px !important;
  }
`;

const CardTitle = styled(Typography)`
  font-weight: bold !important;
  font-size: 1.4rem !important;
  margin-bottom: 0.5rem !important;
  color: #333;
  
  @media (min-width: 1200px) {
    font-size: 1.6rem !important;
    margin-bottom: 0.7rem !important;
  }
`;

const CardDescription = styled(Typography)`
  color: #666;
  margin-bottom: 1rem !important;
  flex-grow: 1;
  font-size: 0.9rem !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  @media (min-width: 1200px) {
    font-size: 1rem !important;
    -webkit-line-clamp: 4;
  }
`;

const ButtonsContainer = styled(Grid)`
  margin-top: auto;
  
  @media (min-width: 1200px) {
    margin-top: 1rem;
  }
`;

const StyledButton = styled(motion.div)`
  width: 100%;
  margin-bottom: 8px !important;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.isLocked ? '#f44336' : '#4caf50'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.progress}%;
  height: 4px;
  background: linear-gradient(90deg, #5650F5, #7A75F7);
  transition: width 0.5s ease;
`;

const InfoTooltip = styled(IconButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8) !important;
  padding: 4px !important;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 255, 1) !important;
  }
`;

const PhaseCard = ({ deck, quizzes, isActive, onClick, phaseNumber }) => {
  const navigate = useNavigate();
  const { loadQuiz, quizData, loading } = useQuiz();
  const { resetSession } = useFlashcards();
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  
  // Verifica se o deck está bloqueado
  const isLocked = deck.isLocked;
  
  // Verifica se há quizzes associados a este deck
  const hasQuizzes = quizzes && quizzes.length > 0;
  
  // Calcula o progresso do deck (simulado para demonstração)
  const progress = deck.progress || 0;
  
  // Verifica se o usuário completou os flashcards
  const hasCompletedFlashcards = deck.flashcardsCompleted || false;
  
  // Função para navegar para o deck de flashcards
  const handleFlashcardsClick = () => {
    if (isLocked) {
      alert('Esta fase está bloqueada. Complete as fases anteriores para desbloquear.');
      return;
    }
    navigate(`/flashcards/${deck.id}`);
  };
  
  // Função para navegar para o quiz
  const handleQuizClick = () => {
    if (isLocked) {
      alert('Esta fase está bloqueada. Complete as fases anteriores para desbloquear.');
      return;
    }
    
    if (!hasQuizzes) {
      alert('Não há quizzes disponíveis para esta fase.');
      return;
    }
    
    // Verifica se o usuário completou os flashcards antes de permitir acesso ao quiz
    if (!hasCompletedFlashcards) {
      alert('Complete os flashcards primeiro para desbloquear o quiz!');
      return;
    }
    
    navigate(`/quiz/${quizzes[0].id}`);
  };
  
  // Função para abrir o modal de vídeo
  const handleVideoClick = () => {
    setOpenVideoModal(true);
  };
  
  // Função para fechar o modal de vídeo
  const handleCloseVideo = () => {
    setOpenVideoModal(false);
  };
  
  // Função para abrir o modal de informações
  const handleInfoClick = (e) => {
    e.stopPropagation();
    setOpenInfoModal(true);
  };
  
  // Função para fechar o modal de informações
  const handleCloseInfo = () => {
    setOpenInfoModal(false);
  };
  
  // Função para lidar com o clique no card
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <StyledCard
        whileHover={isActive && !isLocked ? { y: -10, boxShadow: '0 15px 35px rgba(86, 80, 245, 0.3)' } : {}}
        onClick={isActive ? undefined : handleCardClick}
        style={{ cursor: isActive ? 'default' : isLocked ? 'not-allowed' : 'pointer' }}
      >
        {isLocked ? (
          <StatusBadge isLocked={true}>
            <Lock fontSize="small" />
            Bloqueado
          </StatusBadge>
        ) : deck.isCompleted ? (
          <StatusBadge isLocked={false}>
            <CheckCircle fontSize="small" />
            Completo
          </StatusBadge>
        ) : null}
        
        <InfoTooltip size="small" onClick={handleInfoClick}>
          <Info fontSize="small" color="primary" />
        </InfoTooltip>
        
        <CardImage image={deck.imageUrl || "https://source.unsplash.com/random/300x200/?study"} />
        
        <CardContentWrapper>
          <CardTitle variant="h5">
            {deck.title || `Fase ${phaseNumber}`}
          </CardTitle>
          
          <CardDescription variant="body2">
            {deck.description || "Explore este deck para aprender novos conceitos e testar seus conhecimentos."}
          </CardDescription>
          
          {isActive && (
            <ButtonsContainer container spacing={1}>
              <Grid item xs={12}>
                <StyledButton 
                  whileHover={!isLocked ? { scale: 1.03 } : {}} 
                  whileTap={!isLocked ? { scale: 0.97 } : {}}
                >
                  <Tooltip title={isLocked ? "Fase bloqueada" : "Acessar flashcards"}>
                    <div style={{ width: '100%' }}>
                      <Button
                  variant="contained" 
                        fullWidth
                        onClick={handleFlashcardsClick}
                        disabled={isLocked}
                        startIcon={<School />}
                        sx={{
                          background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                          color: 'white',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 10px rgba(86, 80, 245, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #4840e6 30%, #6965e7 90%)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.6)',
                            background: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
                          }
                        }}
                      >
                        Flashcards
                      </Button>
                    </div>
                  </Tooltip>
                </StyledButton>
              </Grid>
              
              <Grid item xs={12}>
                <Tooltip title={
                  isLocked 
                    ? "Fase bloqueada" 
                    : !hasQuizzes 
                      ? "Não há quizzes disponíveis" 
                      : !hasCompletedFlashcards 
                        ? "Complete os flashcards primeiro" 
                        : "Acessar quiz"
                }>
                  <div style={{ width: '100%' }}>
                    <StyledButton 
                      whileHover={!isLocked && hasQuizzes && hasCompletedFlashcards ? { scale: 1.03 } : {}} 
                      whileTap={!isLocked && hasQuizzes && hasCompletedFlashcards ? { scale: 0.97 } : {}}
                    >
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleQuizClick}
                        disabled={isLocked || !hasQuizzes || !hasCompletedFlashcards}
                        startIcon={<QuestionAnswer />}
                        sx={{
                          borderColor: '#5650F5',
                          color: '#5650F5',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': {
                            borderColor: '#4840e6',
                            backgroundColor: 'rgba(86, 80, 245, 0.05)',
                          },
                          '&.Mui-disabled': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                          }
                        }}
                      >
                        Quiz
                      </Button>
                    </StyledButton>
                  </div>
                </Tooltip>
              </Grid>
              
              <Grid item xs={12}>
                <Tooltip title={!deck.videoUrl ? "Vídeo não disponível" : "Assistir vídeo introdutório"}>
                  <div style={{ width: '100%' }}>
                    <StyledButton whileHover={deck.videoUrl ? { scale: 1.03 } : {}} whileTap={deck.videoUrl ? { scale: 0.97 } : {}}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleVideoClick}
                        disabled={!deck.videoUrl}
                        startIcon={<VideoLibrary />}
                        sx={{
                          borderColor: '#5650F5',
                          color: '#5650F5',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': {
                            borderColor: '#4840e6',
                            backgroundColor: 'rgba(86, 80, 245, 0.05)',
                          },
                          '&.Mui-disabled': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                          }
                        }}
                      >
                        Vídeo
                      </Button>
                    </StyledButton>
                  </div>
            </Tooltip>
              </Grid>
            </ButtonsContainer>
          )}
          
          {/* Indicador de progresso */}
          <ProgressIndicator progress={progress} />
      </CardContentWrapper>
      </StyledCard>
      
      {/* Modal de Vídeo */}
      <Dialog
        open={openVideoModal}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
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
              {deck.title || `Fase ${phaseNumber}`} - Vídeo Introdutório
        </Typography>
            <IconButton
              aria-label="Fechar vídeo"
              onClick={handleCloseVideo}
              sx={{ color: 'white' }}
            >
            <Close />
            </IconButton>
          </Box>
          <ReactPlayer
            url={deck.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            width="100%"
            height="500px"
            controls
            playing
            style={{ maxHeight: '70vh' }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de Informações */}
      <Dialog
        open={openInfoModal}
        onClose={handleCloseInfo}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            overflow: 'hidden',
            margin: '16px'
          }
        }}
      >
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5" sx={{ color: '#5650F5', fontWeight: 'bold' }}>
              {deck.title || `Fase ${phaseNumber}`}
            </Typography>
            <IconButton
              aria-label="Fechar informações"
              onClick={handleCloseInfo}
              sx={{ color: '#5650F5' }}
            >
              <Close />
            </IconButton>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {deck.description || "Explore este deck para aprender novos conceitos e testar seus conhecimentos."}
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#5650F5', mt: 3, mb: 1 }}>
            Requisitos para completar esta fase:
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <School color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Completar todos os flashcards
            </Typography>
          </Box>
          
          {hasQuizzes && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <QuestionAnswer color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Obter pelo menos 70% de acerto no quiz
              </Typography>
            </Box>
          )}
          
          {isLocked && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'rgba(244, 67, 54, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(244, 67, 54, 0.3)'
            }}>
              <Typography variant="body1" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                <Lock fontSize="small" sx={{ mr: 1 }} />
                Esta fase está bloqueada. Complete as fases anteriores para desbloquear.
              </Typography>
            </Box>
          )}
          
          {deck.isCompleted && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                Fase concluída com sucesso!
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleCloseInfo}
              sx={{
                background: 'linear-gradient(45deg, #5650F5 30%, #7A75F7 90%)',
                color: 'white',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(86, 80, 245, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4840e6 30%, #6965e7 90%)',
                },
              }}
            >
              Fechar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhaseCard;
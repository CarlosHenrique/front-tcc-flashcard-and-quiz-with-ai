import React, { useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { Card, CardContent, Typography, Button, Box, Tooltip, Modal, IconButton } from '@mui/material';
import { Lock, CheckCircle, ErrorOutline, Cancel, PlayCircleOutline, Close } from '@mui/icons-material';
import { useQuiz } from '../context/QuizContext';
import { useFlashcards } from '../context/FlashcardsContext';

const StyledCard = styled(Card)`
  margin: 1rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  border-radius: 2rem !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.div`
  height: 150px;
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;
  filter: ${({ unlocked }) => (unlocked ? 'none' : 'blur(5px)')};
`;

const CardContentWrapper = styled(Box)`
  filter: ${({ unlocked }) => (unlocked ? 'none' : 'blur(5px)')};
  pointer-events: ${({ unlocked }) => (unlocked ? 'auto' : 'none')};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.171);
  visibility: ${({ unlocked }) => (unlocked ? 'hidden' : 'visible')};
  text-align: center;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
`;

const NeonButton = styled(Button)`
  && {
    background-color: #5650F5;
    color: white;
    font-weight: bold;
    width: 100%;
    height: 45px;
    font-size: 0.8rem;
    border-radius: 8px;
    transition: 0.2s;
    
    &:hover {
      background-color: #4840e6;
    }
  }
`;

const VideoModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Box)`
  background: white;
  width: 80%;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  padding: 1rem;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const PhaseCard = ({ deck, quiz }) => {
  const { loadQuiz, quizData, loading } = useQuiz();
  const { resetSession } = useFlashcards();
  const [openModal, setOpenModal] = useState(false);

  const unlocked = !deck.isLocked && !quiz.isLocked;
  const isQuizUnlocked = quiz.score >= 70 || deck.score >= 70;

  const handleStartFlashcards = () => {
    resetSession();
  };

  const handleStartQuiz = async () => {
    await loadQuiz(deck.id);
  };

  return (
    <StyledCard>
      <CardImage src={deck.imageUrl} unlocked={unlocked} />
      <CardContentWrapper unlocked={unlocked}>
        <CardContent>
          <Typography variant="h6">{deck.title}</Typography>

          <ButtonContainer>
            <NeonButton onClick={() => setOpenModal(true)} variant="contained" disabled={!unlocked} startIcon={<PlayCircleOutline />}>
              Assistir Vídeo
            </NeonButton>
            <NeonButton onClick={handleStartFlashcards} variant="contained" disabled={!unlocked}>
              Iniciar Flashcards
            </NeonButton>
            <Tooltip title={!isQuizUnlocked ? 'Você precisa completar os flashcards primeiro' : ''} disableHoverListener={isQuizUnlocked}>
              <span>
                <NeonButton 
                  onClick={handleStartQuiz} 
                  variant="contained" 
                  disabled={!isQuizUnlocked} 
                  style={{
                    opacity: isQuizUnlocked ? 1 : 0.8,
                    cursor: isQuizUnlocked ? 'pointer' : 'not-allowed'
                  }}
                >
                  {loading ? 'Carregando...' : 'Iniciar Quiz'}
                </NeonButton>
              </span>
            </Tooltip>
          </ButtonContainer>
        </CardContent>
      </CardContentWrapper>

      <LockOverlay unlocked={unlocked}>
        <Lock fontSize="large" />
        <Typography variant="body1" color="error" fontWeight="bold">
          Fase Bloqueada
        </Typography>
      </LockOverlay>

      {/* Modal com ReactPlayer para exibir o vídeo */}
      <VideoModal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalContent>
          <CloseButton onClick={() => setOpenModal(false)}>
            <Close />
          </CloseButton>
          <Typography variant="h5" style={{ marginBottom: '1rem' }}>
            {deck.title} - Fase de estratégia
          </Typography>
          <ReactPlayer
            url={deck.videoUrl}
            width="100%"
            height="80%"
            controls
          />
        </ModalContent>
      </VideoModal>
    </StyledCard>
  );
};

export default PhaseCard;

import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Button, LinearProgress, Box } from '@mui/material';
import { Lock } from '@mui/icons-material';
import exampleImage from '../assets/images/card-fase-cinco.webp';
import { useNavigate } from 'react-router-dom';

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
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.171);
  visibility: ${({ unlocked }) => (unlocked ? 'hidden' : 'visible')};
`;

const NeonButton = styled(Button)`
  && {
    background-color: #5650F5;
    &:hover {
      background-color: #4840e6;
    }
  }
`;

const NeonProgress = styled(LinearProgress)`
  && {
    background-color: rgba(155, 81, 224, 0.1);
    & .MuiLinearProgress-bar {
      background-color: #9b51e0;
    }
  }
`;

const PhaseCard = ({ phase }) => {
  const navigate = useNavigate();
  const isQuizUnlocked = true; // Ajuste conforme necessário
  const unlocked = true; // Ajuste conforme necessário
  const completed = 50; // Ajuste conforme necessário
  const reviewed = 20; // Ajuste conforme necessário
  
  const handleStartFlashcards = () => {
    navigate('/flashcards', { state: { deck: phase } });
  };

  const handleStartQuiz = () => {
    navigate('/quiz', { state: { deck: phase } });
  };

  return (
    <StyledCard>
      <CardImage src={exampleImage} />
      <CardContentWrapper unlocked={unlocked}>
        <CardContent>
          <Typography variant="h6">{phase.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {phase.theme}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {completed}% completado
          </Typography>
          <NeonProgress variant="determinate" value={completed} />
          <Typography variant="body2" color="textSecondary">
            {reviewed}% Revisado
          </Typography>
          <NeonProgress variant="determinate" value={reviewed} />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <NeonButton onClick={handleStartFlashcards} variant="contained" color="primary" disabled={!unlocked} style={{ marginRight: '0.5rem' }}>
              Iniciar Flashcards
            </NeonButton>
            <NeonButton onClick={handleStartQuiz} variant="contained" color="primary" disabled={!isQuizUnlocked}>
              Iniciar Quiz
            </NeonButton>
          </Box>
        </CardContent>
      </CardContentWrapper>
      <LockOverlay unlocked={unlocked}>
        <Lock fontSize="large" />
      </LockOverlay>
    </StyledCard>
  );
};

export default PhaseCard;

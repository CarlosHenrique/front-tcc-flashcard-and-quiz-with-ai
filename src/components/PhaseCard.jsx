import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Button, LinearProgress, Box, Tooltip } from '@mui/material';
import { Lock, CheckCircle, ErrorOutline, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
const ScoreRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const ScoreText = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 1rem;
    color: #333;
  }
`;

const SubText = styled(Typography)`
  && {
    font-size: 0.8rem;
    color: #777;
  }
`;

const LockMessage = styled(Typography)`
  font-size: 1rem;
  color: #ff0000;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const NeonButton = styled(Button)`
  && {
    background-color: #5650F5;
    &:hover {
      background-color: #4840e6;
    }
  }
`;


const PhaseCard = ({ deck, quiz }) => {
  const navigate = useNavigate();
  const { loadQuiz, quizData, loading } = useQuiz();
  const { resetSession } = useFlashcards();

  const unlocked = !deck.isLocked && !quiz.isLocked;
  const isQuizUnlocked = quiz.score >= 70 || deck.score >= 70;

  const handleStartFlashcards = () => {
    resetSession();
    navigate('/flashcards', { state: { deck } });
  };
  const getLastAttemptText = (lastAccessed) => {
    if (!lastAccessed) return 'Nenhuma tentativa registrada';

    const lastAttemptDate = new Date(lastAccessed);
    const now = new Date();
    const diffDays = Math.floor((now - lastAttemptDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  const handleStartQuiz = async () => {
    await loadQuiz(deck.id);
    navigate('/quiz', { state: { deck, quiz: quizData } });
  };

  return (
    <StyledCard>
      <CardImage src={deck.imageUrl} unlocked={unlocked} />
      <CardContentWrapper unlocked={unlocked}>
        <CardContent>
          <Typography variant="h6">{deck.title}</Typography>
          <ScoreRow>
          <ScoreText>📚 Flashcards:</ScoreText>
          <Typography variant="subtitle1" fontWeight="bold">{deck.score} pontos</Typography>
          {deck.score >= 70 ? (
            <CheckCircle color="success" />
          ) : deck.score >= 50 ? (
            <ErrorOutline color="warning" />
          ) : (
            <Cancel color="error" />
          )}
        </ScoreRow>
        <SubText>Última tentativa: {getLastAttemptText(deck.lastAccessed)}</SubText>

        <ScoreRow>
          <ScoreText>📝 Quiz:</ScoreText>
          <Typography variant="subtitle1" fontWeight="bold">{quiz.score} pontos</Typography>
          {quiz.score >= 70 ? (
            <CheckCircle color="success" />
          ) : quiz.score >= 50 ? (
            <ErrorOutline color="warning" />
          ) : (
            <Cancel color="error" />
          )}
        </ScoreRow>
        <SubText>Última tentativa: {getLastAttemptText(quiz.lastAccessed)}</SubText>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <NeonButton onClick={handleStartFlashcards} variant="contained" disabled={!unlocked}>
              Iniciar Flashcards
            </NeonButton>
            <Tooltip title={!isQuizUnlocked ? 'Você precisa completar os flashcards primeiro' : ''} disableHoverListener={isQuizUnlocked}>
              <span>
                <NeonButton onClick={handleStartQuiz} variant="contained" disabled={!isQuizUnlocked}>
                  {loading ? 'Carregando...' : 'Iniciar Quiz'}
                </NeonButton>
              </span>
            </Tooltip>
          </Box>
        </CardContent>
      </CardContentWrapper>
      <LockOverlay unlocked={unlocked}>
        <Lock fontSize="large" />
        <LockMessage>Fase Bloqueada</LockMessage>
      </LockOverlay>
    </StyledCard>
  );
};

export default PhaseCard;

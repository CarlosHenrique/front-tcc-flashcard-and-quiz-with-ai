import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/client';
import { GET_LAST_USER_QUIZ_RESPONSE } from '../graphql/quiz/queries';
import { Card, CardContent, Typography, Button, LinearProgress, Box } from '@mui/material';
import { Lock } from '@mui/icons-material';
import exampleImage from '../assets/images/card-fase-cinco.webp';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

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
  const { loadQuiz, quizData, loading } = useQuiz();
  const [reviewed, setReviewed] = useState(0);
  const [getLastQuizResponse] = useLazyQuery(GET_LAST_USER_QUIZ_RESPONSE);

  useEffect(() => {
    const fetchLastQuizResponse = async () => {
      const userId = "carlos"; // Substitua pelo ID do usuário real
      const quizId = phase.id;

      try {
        const { data } = await getLastQuizResponse({ variables: { userId, quizId } });
        if (data && data.getLastUserQuizResponse) {
          const score = data.getLastUserQuizResponse.score;
          const totalQuestions = phase.questions ? phase.questions.length : 10; // Ajuste conforme necessário
          const reviewedPercentage = Math.round((score / totalQuestions) * 100);
          setReviewed(reviewedPercentage);
        } else {
          setReviewed(0); // Define como 0% se não houver resposta anterior
        }
      } catch (error) {
        console.error("Erro ao buscar a última resposta do quiz:", error);
        setReviewed(0);
      }
    };

    fetchLastQuizResponse();
  }, [getLastQuizResponse, phase]);

  const isQuizUnlocked = true; // Ajuste conforme necessário
  const unlocked = true; // Ajuste conforme necessário
  const completed = 50; // Ajuste conforme necessário

  const handleStartFlashcards = () => {
    navigate('/flashcards', { state: { deck: phase } });
  };

  const handleStartQuiz = async () => {
    await loadQuiz(phase.id);
    navigate('/quiz', { state: { deck: phase, quiz: quizData } });
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
              {loading ? 'Carregando...' : 'Iniciar Quiz'}
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

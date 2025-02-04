import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box } from '@mui/material';
import PhaseCarousel from '../components/PhaseCarousel';
import Header from '../components/Header';
import { useFlashcards } from '../context/FlashcardsContext';
import { useQuiz } from '../context/QuizContext';

const HomeWrapper = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 8rem; /* Espaço para o header fixo */
  overflow-x: hidden;
`;

const StyledTypography = styled(Typography)`
  && {
    margin-bottom: 2rem;
    color: #5650F5;
  }
`;

const HomePage = () => {
  const { decks, loading: loadingFlashcards, error: errorFlashcards } = useFlashcards();
  const { allQuizzes, fetchAllQuizzes, loading: loadingQuizzes, error: errorQuizzes } = useQuiz(); // Pegando `fetchAllQuizzes`

  // 🔹 Buscar quizzes quando a página for carregada
  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

  useEffect(() => {
    if (loadingFlashcards) {
      console.log('Aguarde, carregando...');
    } else if (decks && decks.length > 0) {
      console.log('Decks carregados!');
    } else if (!loadingFlashcards && decks.length === 0) {
      console.log('Nenhum dado recebido.');
    }

    if (errorFlashcards) {
      console.error('Erro ao carregar os dados:', errorFlashcards);
    }
  }, [decks, loadingFlashcards, errorFlashcards]);

  useEffect(() => {
    if (loadingQuizzes) {
      console.log('Carregando quizzes...');
    } else if (allQuizzes.length > 0) {
      console.log('Quizzes carregados!');
    } else {
      console.log('Nenhum quiz encontrado.');
    }

    if (errorQuizzes) {
      console.error('Erro ao carregar quizzes:', errorQuizzes);
    }
  }, [allQuizzes, loadingQuizzes, errorQuizzes]);

  if (loadingFlashcards || loadingQuizzes) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorFlashcards) {
    return <p>Error: {errorFlashcards.message}</p>;
  }

  if (errorQuizzes) {
    return <p>Error: {errorQuizzes.message}</p>;
  }

  if (decks.length === 0) {
    return <p>Nenhum deck disponível.</p>;
  }


  return (
    <HomeWrapper>
      <Header />
      <StyledTypography variant="h3" className='app-name'>
        Selecione a fase:
      </StyledTypography>
      <PhaseCarousel decks={decks} quizzes={allQuizzes} />
    </HomeWrapper>
  );
};

export default HomePage;

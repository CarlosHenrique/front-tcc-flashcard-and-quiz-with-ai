import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box } from '@mui/material';
import PhaseCarousel from '../components/PhaseCarousel';
import Header from '../components/Header';
import { useFlashcards } from '../context/FlashcardsContext';

const HomeWrapper = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 8rem; /* Espaço para o header fixo */
  overflow-x: hidden; /* Esconder o overflow horizontal */
`;

const StyledTypography = styled(Typography)`
  && {
    margin-bottom: 2rem;
    color: #5650F5;
  }
`;

const HomePage = () => {
  const { decks, loading, error } = useFlashcards();

  useEffect(() => {
    if (loading) {
      console.log('Aguarde, carregando...');
    } else if (decks && decks.length > 0) {
      console.log('Dados recebidos:', decks);
    } else if (!loading && decks.length === 0) {
      console.log('Nenhum dado recebido.');
    }
  
    if (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  }, [decks, loading, error]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
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
      <PhaseCarousel decks={decks} />
    </HomeWrapper>
  );
};

export default HomePage;

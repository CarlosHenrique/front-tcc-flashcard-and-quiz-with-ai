import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box, Fab, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import ReactPlayer from 'react-player';
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

// Estilizando o botão flutuante
const FloatingButton = styled(Fab)`
  && {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #5650F5;
    color: white;
    
    &:hover {
      background-color: #3e39d1;
    }
  }
`;

const HomePage = () => {
  const { decks, loading: loadingFlashcards, error: errorFlashcards } = useFlashcards();
  const { allQuizzes, fetchAllQuizzes, loading: loadingQuizzes, error: errorQuizzes } = useQuiz();

  // Estado para abrir/fechar o modal do vídeo
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

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

      {/* Botão Flutuante com Tooltip informativo */}
      <Tooltip title="Clique para ver um vídeo sobre a plataforma" arrow>
        <FloatingButton onClick={() => setOpenModal(true)} aria-label="Ver vídeo de apresentação">
          <PlayArrow />
        </FloatingButton>
      </Tooltip>

      {/* Modal com o vídeo de apresentação */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton 
            aria-label="Fechar vídeo" 
            onClick={() => setOpenModal(false)} 
            sx={{ position: 'absolute', right: 10, top: 10 }}
          >
            <Close />
          </IconButton>
          <ReactPlayer 
            url="https://youtu.be/E3Sx7Ek-7Vw" // Substitua pelo link do seu vídeo
            width="100%"
            height="400px"
            controls
          />
        </DialogContent>
      </Dialog>
    </HomeWrapper>
  );
};

export default HomePage;

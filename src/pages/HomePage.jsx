import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, CircularProgress, Box, Paper,Fab,Snackbar, Dialog, DialogContent, IconButton, Tooltip , Button} from '@mui/material';
import { PlayArrow, Close , ChatBubbleOutline } from '@mui/icons-material';
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



const HomePage = () => {
  const { decks, loading: loadingFlashcards, error: errorFlashcards } = useFlashcards();
  const { allQuizzes, fetchAllQuizzes, loading: loadingQuizzes, error: errorQuizzes } = useQuiz();

  // Estado para abrir/fechar o modal do vídeo
  const [openModal, setOpenModal] = useState(false);
  const [openMessage, setOpenMessage] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

     {/* Balão de Mensagem */}
     {openMessage && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 80,
            backgroundColor: "#5650F5",
            color: "white",
            padding: "10px 15px",
            borderRadius: "12px",
            maxWidth: "250px",
            display: "flex",
            alignItems: "center",
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
          🎥 Veja como a plataforma funciona em poucos minutos!
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "white", marginLeft: 1 }}
            onClick={() => setOpenMessage(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        </Paper>
      )}

      {/* Botão Flutuante */}
      <Tooltip title="Ver vídeo de apresentação" arrow>
        <Button
          onClick={() => {
            setOpenModal(true);
            setOpenSnackbar(true);
          }}
          variant="contained"
          color="primary"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: "50%",
            width: 60,
            height: 60,
            boxShadow: 3,
            backgroundColor: "#5650F5", // Define a cor do botão
            "&:hover": { backgroundColor: "#4339D6" }, // Cor ao passar o mouse
          }}
        >
          <PlayArrow fontSize="large" />
        </Button>
      </Tooltip>

      {/* Modal com o Vídeo */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            aria-label="Fechar vídeo"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 10, top: 10 }}
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

      {/* Snackbar para reforçar a ação */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="O vídeo pode ser fechado a qualquer momento"
      />
    </HomeWrapper>
  );
};

export default HomePage;

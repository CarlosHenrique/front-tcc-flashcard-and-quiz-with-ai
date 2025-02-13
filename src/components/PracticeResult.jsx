import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Button, Dialog } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #fff;
    padding: 2rem;
  }
`;

export const StyledDialogTitle = styled.div`
  text-align: center;
  color: #5650F5;
  font-family: 'Rowdies', cursive !important;
  font-size: 1.8rem;
  font-weight: bold;
`;

export const StyledDialogContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const StyledButton = styled(Button)`
  background-color: #5650F5 !important;
  color: white !important;
  margin-top: 1rem;
  width: 60%;
  &:hover {
    background-color: #4640D5 !important;
  }
`;

const PracticeResultModal = ({ open, onClose, totalScore, passingScore = 70 }) => {
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => {
        setPassed(totalScore >= passingScore);
        setLoading(false);
      }, 2000);
    }
  }, [open, totalScore, passingScore]);

  const handleRetry = () => {
    onClose();
    navigate('/'); // 🔄 Navega para a HomePage
    setTimeout(() => {
    }, 100); // Pequeno delay para garantir que a navegação acontece antes do reload
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        {loading ? "Calculando resultado..." : passed ? "Parabéns!" : "Tente novamente!"}
      </StyledDialogTitle>
      <StyledDialogContent>
        <CenteredContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6">
                {passed
                  ? "Você completou a fase com sucesso e pode avançar para a próxima etapa!"
                  : "Não foi dessa vez. Continue praticando e tente novamente!"}
              </Typography>
              <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Sua pontuação: {totalScore} pontos
              </Typography>
              <StyledButton onClick={handleRetry}>
                {passed ? "Avançar" : "Tentar novamente"}
              </StyledButton>
            </>
          )}
        </CenteredContainer>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default PracticeResultModal;

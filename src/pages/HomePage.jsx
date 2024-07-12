import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import PhaseCarousel from '../components/PhaseCarousel';
import Header from '../components/Header';

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
  return (
    <HomeWrapper>
      <Header />
      <StyledTypography variant="h3" className='app-name'>
        Selecione a fase:
      </StyledTypography>
      <PhaseCarousel />
    </HomeWrapper>
  );
};

export default HomePage;

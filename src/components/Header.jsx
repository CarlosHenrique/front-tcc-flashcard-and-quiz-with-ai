import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Typography, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5650F5;
  padding: 0.5rem 1rem;
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileIcon = styled(AccountCircle)`
  && {
    font-size: 3rem;
    margin-right: 1rem;
    color: #fff;
  }
`;

const Header = () => {

  const navigate = useNavigate();
  
  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <HeaderWrapper>
      <Typography variant="h4" className="app-name">
        FlashQuiz
      </Typography>
      <IconButton onClick={handleNavigateToHome}>
        <ProfileIcon />
      </IconButton>
    </HeaderWrapper>
  );
};

export default Header;

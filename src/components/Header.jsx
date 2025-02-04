import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Typography, IconButton, Menu, MenuItem, Modal, Box, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import '@fontsource/rowdies'; // Importa a fonte Rowdies

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
    margin-right: 2rem;
    color: #fff;
  }
`;

const Logo = styled(Typography)`
  && {
    cursor: pointer;
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    font-family: 'Rowdies', cursive !important;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    font-family: 'Rowdies', cursive !important;
    color: #5650F5 !important;
  }
`;

const ModalBox = styled(Box)`
  width: 300px;
  background: white;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToHome = () => {
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setOpenModal(true);
  };

  const handleConfirmLogout = () => {
    setOpenModal(false);
    logout();
  };

  return (
    <HeaderWrapper>
      <Logo variant="h4" onClick={handleNavigateToHome}>
        FlashQuiz
      </Logo>

      <IconButton onClick={handleMenuOpen}>
        <ProfileIcon />
      </IconButton>

      {/* Menu suspenso */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <StyledMenuItem onClick={() => navigate('/profile')}>Minhas Badges</StyledMenuItem>
        <StyledMenuItem onClick={handleLogoutClick}>Logout</StyledMenuItem>
      </Menu>

      {/* Modal de Confirmação */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <ModalBox>
            <Typography variant="h6" mb={2}>Deseja realmente sair?</Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5650F5",
                "&:hover": { backgroundColor: "#4038d9" }
              }}
              onClick={handleConfirmLogout}
              style={{ marginRight: '10px' }}
            >
              Sim
            </Button>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancelar</Button>
          </ModalBox>
        </Box>
      </Modal>
    </HeaderWrapper>
  );
};

export default Header;

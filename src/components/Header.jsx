import React, { useState } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Tooltip, Button } from '@mui/material';
import { Settings, Logout, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../assets/images/mainLogo.svg';

// Estilos
const StyledAppBar = styled(AppBar)`
  background: linear-gradient(90deg, #5650F5 0%, #7A75F7 100%);
  box-shadow: 0 4px 20px rgba(86, 80, 245, 0.25);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1.5rem !important;
  box-sizing: border-box;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled(motion.div)`
  margin-left: 1rem;
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Lógica de logout aqui
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LogoContainer
          onClick={goToHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo src={mainLogo} alt="Logo" />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            FlashQuiz
          </Typography>
        </LogoContainer>

        <NavItems>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                fontWeight: 'bold',
                marginRight: '1rem',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Dashboard
            </Button>
          </motion.div>
          
          <UserAvatar>
            <Tooltip title="Opções da conta">
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ 
                  ml: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                }}
              >
                <Avatar 
                  alt="User" 
                  src="/avatar.png"
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
            </Tooltip>
          </UserAvatar>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                borderRadius: '12px',
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <StyledMenuItem onClick={handleProfile}>
              <Person fontSize="small" color="primary" />
              <Typography variant="body1">Perfil</Typography>
            </StyledMenuItem>
            
            <StyledMenuItem onClick={handleSettings}>
              <Settings fontSize="small" color="primary" />
              <Typography variant="body1">Configurações</Typography>
            </StyledMenuItem>
            
            <StyledMenuItem onClick={handleLogout}>
              <Logout fontSize="small" color="error" />
              <Typography variant="body1" color="error">Sair</Typography>
            </StyledMenuItem>
          </Menu>
        </NavItems>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '../graphql/auth/mutations';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';
import loginAnimation from '../assets/animations/login-animation.json';
import logo from '../assets/images/mainLogo.svg';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const LeftPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #FFFFFF;
  padding: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const RightPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #5650F5;
  color: #FFFFFF;
  font-family: 'Rowdies', cursive;
  padding: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 30vh;
  }
`;

const StyledForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0 !important;

  .MuiInputBase-root {
    height: 3rem;
    border-radius: 8px;
    background-color: #FFFFFF;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #5650F5 !important;
  color: white !important;
  padding: 0.5rem 1.5rem !important;
  border-radius: 8px !important;
  margin-top: 1rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px rgba(86, 80, 245, 0.2) !important;

  &:hover {
    background-color: #4540d6 !important;
    box-shadow: 0 6px 10px rgba(86, 80, 245, 0.3) !important;
    transform: translateY(-2px) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
`;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição não encontrado na URL.');
    }
  }, [token]);

  const onSubmit = async (data) => {
    setError(null);
    setMessage(null);
    try {
      const response = await resetPassword({
        variables: {
          input: {
            token,
            newPassword: data.password,
          },
        },
      });

      setMessage(response.data.resetPassword);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError('Erro ao redefinir a senha. O link pode ter expirado.');
    }
  };

  return (
    <Wrapper>
      <LeftPanel
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          style={{ width: '150px', marginBottom: '2rem' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
            Redefinir senha
          </Typography>

          <StyledTextField
            label="Nova senha"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password', {
              required: 'Senha obrigatória',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            label="Confirmar senha"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('confirmPassword', {
              validate: (value) =>
                value === watch('password') || 'As senhas não coincidem',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
          </SubmitButton>

          {message && <Alert severity="success" style={{ marginTop: '1rem' }}>{message}</Alert>}
          {error && <Alert severity="error" style={{ marginTop: '1rem' }}>{error}</Alert>}
        </StyledForm>
      </LeftPanel>

      <RightPanel
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Typography
            variant="h3"
            component="h1"
            className="app-name"
            style={{
              marginBottom: '2rem',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            FlashQuiz
          </Typography>
          <Typography
            variant="h6"
            style={{
              textAlign: 'center',
              maxWidth: '80%',
              lineHeight: 1.4,
              marginBottom: '2rem'
            }}
          >
            Defina sua nova senha com segurança.
          </Typography>

          <Lottie
            loop
            animationData={loginAnimation}
            play
            style={{ width: 150, height: 150 }}
          />
        </motion.div>
      </RightPanel>
    </Wrapper>
  );
};

export default ResetPasswordPage;

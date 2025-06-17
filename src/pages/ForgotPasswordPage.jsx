import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD_MUTATION } from '../graphql/auth/mutations';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment
} from '@mui/material';
import { Email } from '@mui/icons-material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';
import loginAnimation from '../assets/animations/login-animation.json';
import logo from '../assets/images/mainLogo.svg';

const ForgotWrapper = styled.div`
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
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
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

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #5650F5;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 2px;
    border-color: #5650F5;
  }

  .MuiInputLabel-root {
    color: #666666;

    &.Mui-focused {
      color: #5650F5;
    }
  }

  .MuiInputBase-input {
    color: #333333;
  }

  .MuiFormHelperText-root {
    color: #666666;
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

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setMessage(null);
      setError(null);
      const response = await forgotPassword({
        variables: { input: { email: data.email } },
      });
      setMessage(response.data.forgotPassword);
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
    }
  };

  return (
    <ForgotWrapper>
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
            Recuperar senha
          </Typography>

          <StyledTextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email', {
              required: 'Informe o email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar link de recuperação'}
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
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Typography
            variant="h5"
            style={{
              textAlign: 'center',
              maxWidth: '80%',
              margin: '0 auto',
              lineHeight: 1.4
            }}
          >
            Insira seu email para receber o link de recuperação de senha.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ marginTop: '2rem' }}
        >
          <Lottie
            loop
            animationData={loginAnimation}
            play
            style={{ width: 150, height: 150 }}
          />
        </motion.div>
      </RightPanel>
    </ForgotWrapper>
  );
};

export default ForgotPasswordPage;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Link, IconButton, InputAdornment, Box, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/mainLogo.svg';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/auth/mutations';

const LoginWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #fff;
  padding: 2rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #5650F5;
  color: #fff;
  font-family: 'Rowdies', cursive;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0 !important;
  width: 100%;

  .MuiInputBase-root {
    height: 2.5rem; 
    min-width: 24rem;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

const LoginButton = styled(Button)`
  background-color: #5650F5 !important;
  color: white !important;
  margin-right: 1rem;
`;

const SignupButton = styled(Button)`
  background-color: white !important;
  color: #5650F5 !important;
  border: 1px solid #5650F5 !important;
`;

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userLogin] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login?.access_token && data?.login?.email) {
        login(
          { email: data.login.email }, // 🔹 Agora passando os dados corretamente
          data.login.access_token
        );
      } else {
        console.error('❌ Resposta inesperada do servidor:', data);
        setErrorMessage('Erro ao processar login.');
      }
    },
    
  });
  
  
  const [signUp] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      login(data.signUp.user, data.signUp.access_token);
      navigate('/');
    },
    onError: (error) => {
      console.error('Erro ao cadastrar:', error);
      setErrorMessage('Erro ao cadastrar. Verifique os dados e tente novamente.');
    },
  });

  const onSubmit = async (data) => {
    setErrorMessage(null); // Resetar erro antes da tentativa
    try {
      if (isSignup) {
        await signUp({
          variables: { input: { email: data.email, password: data.password, preferredName: data.name } },
        });
      } else {
        await userLogin({
          variables: { input: { email: data.email, password: data.password } },
        });
      }
    } catch (error) {
      console.error('Erro ao processar requisição:', error);
    }
  };

  return (
    <LoginWrapper>
      <LeftPanel>
        <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '2rem' }} />

        {/* Alerta de erro */}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage(null)} style={{ width: '100%', maxWidth: '400px', marginBottom: '1rem' }}>
            {errorMessage}
          </Alert>
        )}

        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          {isSignup && (
            <StyledTextField
              label="Como gostaria de ser chamado?"
              variant="outlined"
              placeholder="Digite seu nome"
              fullWidth
              {...register('name', { required: 'Nome é obrigatório' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
          <StyledTextField
            label="Email"
            variant="outlined"
            placeholder="Digite seu email"
            fullWidth
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            fullWidth
            {...register('password', {
              required: 'Senha é obrigatória',
              minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <ButtonsWrapper>
            <LoginButton variant="contained" type="submit">
              {isSignup ? 'Cadastrar' : 'Entrar'}
            </LoginButton>
            <SignupButton variant="contained" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Voltar' : 'Inscrever-se'}
            </SignupButton>
          </ButtonsWrapper>
        </LoginForm>
      </LeftPanel>
      <RightPanel>
        <Typography variant="h3" component="h1" className="app-name" style={{ marginBottom: '2rem' }}>
          FlashQuiz
        </Typography>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Entre para acessar seus baralhos e quizzes
        </Typography>
      </RightPanel>
    </LoginWrapper>
  );
};

export default LoginPage;

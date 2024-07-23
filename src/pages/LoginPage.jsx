import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Link, IconButton, InputAdornment, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/mainLogo.svg';
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

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
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

const PasswordChecklist = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 0.2rem;
  width: 100%;
  font-size: 0.6rem;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  font-size: 0.6rem;
  color: ${props => (props.valid ? 'green' : 'red')};
  margin-bottom: 0.2rem;
`;

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [userLogin] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log('Login completed:', data);
      login(data.login.user, data.login.access_token);
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });
 
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const { login } = useAuth();
  const [signUp] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      console.log('Sign Up completed:', data);
      login(data.signUp.user, data.signUp.access_token);
    },
    onError: (error) => {
      console.error('Error signing up:', error);
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isSignup) {
        const response = await signUp({ variables: { input: { email: data.email, password: data.password, preferredName: data.name } } });
        console.log('Cadastro:', response.data.signUp);
        setIsSignup(false);
      } else {
        const response = await userLogin({ variables: { input: { email: data.email, password: data.password } } });
        const token = response.data.login.access_token;
        login({ email: data.email }, token);
      }
    } catch (error) {
      console.error('Erro ao fazer login/cadastro:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleToggleSignup = () => {
    setIsSignup(!isSignup);
  };

  const isPasswordValid = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const passwordValidity = isPasswordValid(password);

  return (
    <LoginWrapper>
      <LeftPanel>
        <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '2rem' }} />
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          {isSignup && (
            <StyledTextField
              label="Como gostaria de ser chamado?"
              variant="outlined"
              placeholder="Digite seu nome"
              fullWidth
              {...register('name', {
                required: 'Nome é obrigatório',
              })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
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
            helperText={errors.email ? errors.email.message : ''}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            fullWidth
            {...register('password', {
              required: 'Senha é obrigatória',
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, números e caracteres especiais',
              }
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isSignup && (
            <>
              <StyledTextField
                label="Confirmar Senha"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                fullWidth
                {...register('confirmPassword', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) => value === password || 'As senhas não correspondem',
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordChecklist>
                <ChecklistItem valid={passwordValidity.length}>{passwordValidity.length ? 'Mínimo de 8 caracteres' : '* Mínimo de 8 caracteres'}</ChecklistItem>
                <ChecklistItem valid={passwordValidity.uppercase}>{passwordValidity.uppercase ? 'Uma letra maiúscula' : '* Uma letra maiúscula'}</ChecklistItem>
                <ChecklistItem valid={passwordValidity.number}>{passwordValidity.number ? 'Um número' : '* Um número'}</ChecklistItem>
                <ChecklistItem valid={passwordValidity.specialChar}>{passwordValidity.specialChar ? 'Um caractere especial' : '* Um caractere especial'}</ChecklistItem>
                <ChecklistItem valid={confirmPassword === password}>{confirmPassword === password ? 'Senhas coincidem' : '* Senhas coincidem'}</ChecklistItem>
              </PasswordChecklist>
            </>
          )}
          {!isSignup && (
            <ActionsContainer>
              <Link href="#" variant="body2">
                Recuperar senha
              </Link>
            </ActionsContainer>
          )}
          <ButtonsWrapper>
            <LoginButton variant="contained" color="primary" type="submit">
              {isSignup ? 'Cadastrar' : 'Entrar'}
            </LoginButton>
            <SignupButton variant="contained" onClick={handleToggleSignup}>
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

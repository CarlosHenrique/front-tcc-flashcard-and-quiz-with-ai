import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, IconButton, InputAdornment, Box, Alert, CircularProgress, Fade } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie-player';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/mainLogo.svg';
import loginAnimation from '../assets/animations/login-animation.json';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/auth/mutations';

const LoginWrapper = styled.div`
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
  position: relative;
  z-index: 1;

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

const LoginForm = styled(motion.form)`
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
    height: 3rem; 
    min-width: 24rem;
    border-radius: 8px;
    background-color: #FFFFFF;
    
    @media (max-width: 768px) {
      min-width: unset;
    }
  }
  
  .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #5650F5;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-width: 2px;
      border-color: #5650F5;
    }
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

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
`;

const LoginButton = styled(Button)`
  background-color: #5650F5 !important;
  color: white !important;
  margin-right: 1rem;
  padding: 0.5rem 1.5rem !important;
  border-radius: 8px !important;
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
  
  &.Mui-disabled {
    background-color: #9e9e9e !important;
    box-shadow: none !important;
  }
`;

const SignupButton = styled(Button)`
  background-color: #FFFFFF !important;
  color: #5650F5 !important;
  border: 1px solid #5650F5 !important;
  padding: 0.5rem 1.5rem !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    background-color: rgba(86, 80, 245, 0.05) !important;
    transform: translateY(-2px) !important;
  }
  
  &:active {
    transform: translateY(0) !important;
  }
`;

const ToggleText = styled(motion.p)`
  margin-top: 1.5rem;
  color: #666666;
  font-size: 0.9rem;
  
  span {
    color: #5650F5;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AlertWrapper = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
`;

const FormTitle = styled(motion.h2)`
  color: #333333;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.8rem;
  align-self: flex-start;
`;

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Resetar o formulário quando alternar entre login e cadastro
  useEffect(() => {
    reset();
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isSignup, reset]);

  const [userLogin] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data?.login?.access_token && data?.login?.email) {
        setSuccessMessage('Login realizado com sucesso!');
        setTimeout(() => {
          login(
            { email: data.login.email },
            data.login.access_token
          );
          navigate('/');
        }, 1000);
      } else {
        console.error('❌ Resposta inesperada do servidor:', data);
        setErrorMessage('Erro ao processar login.');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      const errorMessage = error.message.includes('credentials')
        ? 'Email ou senha incorretos'
        : 'Erro ao fazer login. Tente novamente.';
      setErrorMessage(errorMessage);
    }
  });
  
  const [signUp] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      setIsLoading(false);
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        login(data.signUp.user, data.signUp.access_token);
        navigate('/');
      }, 1500);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error('Erro ao cadastrar:', error);
      const errorMsg = error.message.includes('already exists') 
        ? 'Este email já está cadastrado. Tente fazer login.'
        : 'Erro ao cadastrar. Verifique os dados e tente novamente.';
      setErrorMessage(errorMsg);
    },
  });

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Variantes de animação
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  return (
    <LoginWrapper>
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

        <AnimatePresence mode="wait">
          {errorMessage && (
            <AlertWrapper
              key="error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="error" 
                onClose={() => setErrorMessage(null)} 
                style={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
            </AlertWrapper>
          )}

          {successMessage && (
            <AlertWrapper
              key="success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="success" 
                style={{ width: '100%' }}
              >
                {successMessage}
              </Alert>
            </AlertWrapper>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <LoginForm 
            key={isSignup ? 'signup' : 'login'}
            onSubmit={handleSubmit(onSubmit)}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FormTitle
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSignup ? 'Criar Conta' : 'Bem-vindo de volta!'}
            </FormTitle>
            
            {isSignup && (
              <motion.div width="100%" variants={itemVariants}>
                <StyledTextField
                  label="Como gostaria de ser chamado?"
                  variant="outlined"
                  placeholder="Digite seu nome"
                  fullWidth
                  {...register('name', { required: 'Nome é obrigatório' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            )}
            
            <motion.div width="100%" variants={itemVariants}>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
            
            <motion.div width="100%" variants={itemVariants}>
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
              
            </motion.div>
            {isSignup && (
  <motion.div width="100%" variants={itemVariants} style={{ marginTop: '1rem' }}>
    <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start' }}>
      <input
        type="checkbox"
        {...register('acceptTerms', {
          validate: value =>
            !isSignup || value || 'Você precisa aceitar a política de privacidade.',
        })}
        style={{ marginRight: '8px', marginTop: '3px' }}
      />
      Ao se cadastrar, você concorda com a nossa&nbsp;
      <span
        style={{ color: '#5650F5', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={() => window.open('/privacy-policy', '_blank')}
      >
        Política de Privacidade
      </span>
      .
    </label>
    {errors.acceptTerms && (
      <Typography variant="caption" color="error">
        {errors.acceptTerms.message}
      </Typography>
    )}
  </motion.div>
)}
            
            <motion.div width="100%" variants={itemVariants}>
 {!isSignup &&<Typography
    style={{
      fontSize: '0.85rem',
      color: '#5650F5',
      cursor: 'pointer',
      marginTop: '-0.5rem',
      marginBottom: '1rem',
      alignSelf: 'flex-end',
    }}
    onClick={() => navigate('/forgot-password')}
  >
    Esqueceu sua senha?
  </Typography>} 
</motion.div>

            <motion.div width="100%" variants={itemVariants}>
              <ButtonsWrapper>
                <LoginButton 
                  variant="contained" 
                  type="submit" 
                  disabled={isLoading}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isSignup ? 'Cadastrar' : 'Entrar'
                  )}
                </LoginButton>
                <SignupButton 
                  variant="contained" 
                  onClick={() => setIsSignup(!isSignup)}
                  disabled={isLoading}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSignup ? 'Voltar' : 'Inscrever-se'}
                </SignupButton>
              </ButtonsWrapper>
            </motion.div>
            
            <ToggleText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isSignup 
                ? 'Já possui uma conta? ' 
                : 'Não possui uma conta? '
              }
              <span onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Faça login' : 'Cadastre-se'}
              </span>
            </ToggleText>
          </LoginForm>
        </AnimatePresence>
      </LeftPanel>
      
      <RightPanel
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Círculos decorativos animados */}
        <motion.div
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            width: '300px', 
            height: '300px', 
            top: '-50px', 
            right: '-50px' 
          }}
        />
        <motion.div
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          style={{ 
            width: '200px', 
            height: '200px', 
            bottom: '50px', 
            left: '30px' 
          }}
        />
        
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
            Entre para acessar seus baralhos e quizzes
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
    </LoginWrapper>
  );
};

export default LoginPage;

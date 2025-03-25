import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import HomePage from './pages/HomePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/quiz/QuizPage';
import LoginPage from './pages/LoginPage';
import BadgePage from './pages/ProfilePage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #FFFFFF;
    color: #000000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }
`;

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute>
                <HomePage key={location.pathname === '/' ? new Date().getTime() : 'home'} />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/flashcards/:deckId"
          element={user ? <PrivateRoute><FlashcardsPage /></PrivateRoute> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={user ? <PrivateRoute><BadgePage /></PrivateRoute> : <Navigate to="/login" />}
        />

        <Route
          path="/quiz/:deckId/:quizId"
          element={
            user ? (
              <PrivateRoute>
                <QuizPage key={location.pathname} />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;

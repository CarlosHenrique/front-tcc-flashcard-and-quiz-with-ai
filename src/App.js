import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/quiz/QuizPage';
import LoginPage from './pages/LoginPage';
import BadgePage from './pages/ProfilePage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Captura a URL atual

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Adicionamos uma key para a HomePage ser recriada ao navegar para "/" */}
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
  );
};

export default App;

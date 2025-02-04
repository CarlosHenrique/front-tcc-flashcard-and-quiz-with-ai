import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
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

      <Route
        path="/"
        element={user ? <PrivateRoute><HomePage /></PrivateRoute> : <Navigate to="/login" />}
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
        element={user ? <PrivateRoute><QuizPage /></PrivateRoute> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;

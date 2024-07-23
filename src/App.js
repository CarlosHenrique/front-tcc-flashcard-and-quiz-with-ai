import React from 'react';
import {  Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PrivateRoute from './components/PrivateRoute';

import { useAuth } from './context/AuthContext';
import { FlashcardsProvider } from './context/FlashcardsContext';

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
    
    <FlashcardsProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/flashcards"
          element={
            user ? (
              <PrivateRoute>
                <FlashcardsPage />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz"
          element={
            user ? (
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      </FlashcardsProvider>
    
  );
};

export default App;

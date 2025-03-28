import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/dashboard/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import QuizPage from '../pages/quiz/QuizPage';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          user ? (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/quiz/:deckId/:quizId"
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
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FlashcardsProvider } from '../context/FlashcardsContext';
import { QuizProvider } from '../context/QuizContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <QuizProvider>
      <FlashcardsProvider>
        {children}
      </FlashcardsProvider>
    </QuizProvider>
  );
};

export default PrivateRoute;

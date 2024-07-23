// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GlobalStyle from './styles/GlobalStyle';
import dotenv from 'dotenv'
dotenv.config();
ReactDOM.render(
  <Router>
  <ApolloProvider client={client}>
     <AuthProvider>
    <GlobalStyle />
    <App />
    </AuthProvider>
  </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

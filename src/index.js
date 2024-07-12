// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import App from './App';
import GlobalStyle from './styles/GlobalStyle';
import dotenv from 'dotenv'
dotenv.config();
ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

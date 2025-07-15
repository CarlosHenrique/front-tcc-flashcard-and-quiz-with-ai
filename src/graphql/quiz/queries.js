// src/graphql/quiz/queries.js
import { gql } from '@apollo/client';

export const GET_QUIZ_BY_DECK_ASSOCIATED_ID = gql`
 query GetQuizFromUser($userId: String!, $deckId: String!) {
  getQuizFromUser(userId: $userId, deckId: $deckId) {
    id
    title
    description
    deckAssociatedId
    ownerId
    
    score
    lastAccessed
    questions {
      id
      question
      answer
      options
      explanation
      difficulty
      category
      type
    }
  }
}

`;

export const GET_LAST_USER_QUIZ_RESPONSE = gql`
  query getLastUserQuizResponse($userId: String!, $quizId: String!) {
    getLastUserQuizResponse(userId: $userId, quizId: $quizId) {
      __typename
      score
    }
  }
`;

export const GET_ALL_QUIZZES_FROM_USER = gql`
query getAllQuizzesFromUser($id: String!){
  getAllQuizzesFromUser(id: $id){
    id
     title
    description
    deckAssociatedId
    questions{
      id
      question
      type
      answer
      options
      explanation
      difficulty
      category
    }
    ownerId
    
    score
    lastAccessed
  }
}
`
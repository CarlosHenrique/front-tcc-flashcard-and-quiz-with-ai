// src/graphql/quiz/queries.js
import { gql } from '@apollo/client';

export const GET_QUIZ_BY_DECK_ASSOCIATED_ID = gql`
  query getQuizByDeckAssociatedId($input: String!) {
    getQuizByDeckAssociatedId(id: $input) {
      id
      title
      description
      questions {
        id
        question
        type
        answer 
        options
        explanation
        difficulty
        category
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
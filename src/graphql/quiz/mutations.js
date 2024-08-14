import { gql } from '@apollo/client';

export const SAVE_USER_QUIZ_RESPONSE = gql`
mutation saveQuizUserResponse($input: CreateUserQuizResponseInput!) {
    createUserQuizResponse(input: $input) {
     userId
      quizId
      selectedQuestionIds
      score
      totalQuizTime
      date
      __typename
      questionMetrics{
        questionId
        attempts
        timeSpent
        correct
      }
    }}`;
import { gql } from '@apollo/client';

export const SAVE_DECK_RESPONSE = gql`
mutation SaveDeckResponse($input: CreateUserDeckResponseInput!) {
  createUserDeckResponse(input: $input) {
    userId
    deckId
    totalSessionScore
    date
    cardMetrics {
      cardId
      attempts
      reviewQuality
      easeFactor
      nextReviewDate
      lastAttempt
    }
  }
}
`;
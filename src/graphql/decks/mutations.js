import { gql } from '@apollo/client';

export const SAVE_DECK_RESPONSE = gql`
mutation saveDeckUserResponse($input: CreateUserDeckResponseInput!) {
  createUserDeckResponse(input: $input){
    userId
    deckId
    selectedCardsIds
    score
    date
    cardMetrics{
      cardId
      attempts
      score
      nextReviewDate
      lastAttempt
    }
  }
}
`;
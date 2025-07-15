import { gql } from '@apollo/client';

export const GET_ALL_DECKS = gql`
  query GetAllDecksFromUser($id: String!){
  getAllDecksFromUser(id: $id){
    id
    ownerId
    title
    imageUrl
    videoUrl
    nextDeckReviewDate
    theme
    cards{
      id
      question
      answer
      practiceExample
      category
      difficulty
    }
    score

    lastAccessed
  }
}
`;

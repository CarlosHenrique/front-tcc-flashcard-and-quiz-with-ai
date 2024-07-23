import { gql } from '@apollo/client';

export const GET_ALL_DECKS = gql`
  query getAllDecks {
    getAllDecks {
      id
      title
      theme
      cards {
        id
        question
        answer
        practiceExample
        category
        difficulty
      }
    }
  }
`;

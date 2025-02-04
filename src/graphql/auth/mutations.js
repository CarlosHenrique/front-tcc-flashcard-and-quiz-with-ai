import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginUserInput!) {
    login(input: $input) {
      access_token
      email
    }
  }
`;

export const SIGNUP_MUTATION = gql`
 mutation signUp($input: CreateUserInput!){
  signUp(input: $input){
    preferredName
    email
  }
}
`;

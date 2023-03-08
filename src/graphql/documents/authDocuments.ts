import gql from "graphql-tag";

export const RefreshTokenDocument = gql`
  mutation RefreshToken($refresh_token: String) {
    refreshToken(input: { refresh_token: $refresh_token }) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`;

export const RegisterDocument = gql`
  mutation Register(
    $email: String!
    $password: String!
    $password_confirmation: String!
    $role: RoleEnum!
  ) {
    register(
      input: {
        email: $email
        password: $password
        password_confirmation: $password_confirmation
        role: $role
        first_name: "Default"
        last_name: "Default"
      }
    ) {
      status
      tokens {
        access_token
        refresh_token
      }
    }
  }
`;

export const ResendEmailConfirmationDocument = gql`
  mutation ResendEmailConfirmation($email: String!) {
    resendEmailConfirmation(input: { email: $email }) {
      status
    }
  }
`;

export const CreateQuizzAnswerDocument = gql`
  mutation CreateQuizzAnswer($quizz_id: ID!, $value: StringOrUpload!) {
    createQuizzAnswer(input: { quizz_id: $quizz_id, value: $value }) {
      id
      value
    }
  }
`;

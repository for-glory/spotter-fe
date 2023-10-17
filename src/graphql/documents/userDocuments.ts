import gql from "graphql-tag";

export const UserDocument = gql`
  query user($id: ID!, $email: String) {
    user(id: $id, email: $email) {
      id
      email
      gender
      created_at
      updated_at
    }
  }
`;

export const FollowTrainerDocument = gql`
  mutation FollowTrainer($trainer_id: ID!) {
    followTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`;

export const UnfollowTrainerDocument = gql`
  mutation UnfollowTrainer($trainer_id: ID!) {
    unfollowTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`;

export const GetTrainerDocument = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      first_name
      last_name
      description
      avatar
      score
      avatarUrl
      facilities {
        address {
          street
        }
      }
      settings {
        setting {
          code
        }
        value
      }
    }
  }
`;

export const GetFacilityDocument = gql`
  query Facility($id: ID!) {
    facility(id: $id) {
      was_commented_by_me
      was_visited_by_me
      address {
        lat
        lng
        street
      }
      created_at
      equipments {
        name
        id
        icon
        iconUrl
      }
      id
      is_followed
      media {
        path
        pathUrl
      }
      name
      score
      description
      not_recommended_count
      recommended_count
      reviews_count
      positive_reviews_count
      negative_reviews_count
      amenities {
        id
        name
        icon
        iconUrl
      }
    }
  }
`;

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

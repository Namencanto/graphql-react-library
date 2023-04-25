import { gql } from "@apollo/client";

const VERIFY_USER = gql`
  query {
    verifyUser {
      id
      name
      admin
    }
  }
`;

export { VERIFY_USER };

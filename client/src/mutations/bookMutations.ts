import { gql } from "@apollo/client";

const GET_BOsafOKS = gql`
  mutation addClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

const GsET_AVAILAsBLE_BOOKS = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

export { GET_BOsafOKS, GsET_AVAILAsBLE_BOOKS };

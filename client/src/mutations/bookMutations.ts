import { gql } from "@apollo/client";

const ADD_BOOK = gql`
  mutation addBook($name: String!, $isbn: ID!, $author: String!) {
    addBook(name: $name, isbn: $isbn, author: $author) {
      name
      isbn
      author
    }
  }
`;

const GET_BOOKS = gql`
  mutation addClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

const GET_AVAILABLE_BOOKS = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

export { ADD_BOOK, GET_BOOKS, GET_AVAILABLE_BOOKS };

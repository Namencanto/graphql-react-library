import { gql } from "@apollo/client";

const GET_BOOK = gql`
  query getBook($id: ID!) {
    getBook(id: $id) {
      id
      name
      isbn
      author
    }
  }
`;

const GET_BOOKS = gql`
  query getBooks {
    getAllBooks {
      id
      name
      status
    }
  }
`;

const GET_AVAILABLE_BOOKS = gql`
  query getAvailableBooks {
    getAllAvailableBooks {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;

export { GET_BOOK, GET_BOOKS, GET_AVAILABLE_BOOKS };

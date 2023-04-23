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
  query getAllBooks {
    getAllBooks {
      id
      name
      isbn
      author
    }
  }
`;

const GET_AVAILABLE_BOOKS = gql`
  query getAvailableBooks {
    getAllAvailableBooks {
      id
      name
      isbn
      author
    }
  }
`;

export { GET_BOOK, GET_BOOKS, GET_AVAILABLE_BOOKS };

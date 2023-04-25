import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import { client } from "../../App";
import { GET_BOOKS } from "../../queries/bookQueries";
import {
  ADD_BOOK,
  BORROW_BOOK,
  DELETE_BOOK,
  RETURN_BOOK,
  UPDATE_BOOK,
} from "../../mutations/bookMutations";

export interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk("books/fetch", async () => {
  try {
    const { data } = await client.query({
      query: GET_BOOKS,
      fetchPolicy: "network-only",
    });

    return data.getAllBooks;
  } catch (error) {
    throw new Error("Something went wrong...");
  }
});

export const addNewBook = createAsyncThunk(
  "books/addNewBook",
  async (newBook: { name: string; author: string; isbn: number }, thunkAPI) => {
    try {
      await client.mutate({
        mutation: ADD_BOOK,
        variables: {
          name: newBook.name,
          author: newBook.author,
          isbn: newBook.isbn,
        },
      });

      const res = await thunkAPI.dispatch(fetchBooks());

      return res;
      // return response.data.addBook as Book;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const editBook = createAsyncThunk(
  "books/editBook",
  async (
    editedBook: {
      id: number;
      name: string;
      author: string;
      isbn: string;
    },
    thunkAPI
  ) => {
    try {
      console.log("first");
      const resultEdit = await client.mutate({
        mutation: UPDATE_BOOK,
        variables: {
          id: +editedBook.id,
          name: editedBook.name,
          author: editedBook.author,
          isbn: editedBook.isbn,
        },
      });

      if (resultEdit) {
        const res = await thunkAPI.dispatch(fetchBooks());
        return res.payload;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (deleteBook: { id: number }, thunkAPI) => {
    try {
      await client.mutate({
        mutation: DELETE_BOOK,
        variables: {
          id: +deleteBook.id,
        },
      });

      const res = await thunkAPI.dispatch(fetchBooks());

      return res.payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const borrowBook = createAsyncThunk(
  "books/borrowBook",
  async (borrowBook: { id: number }, thunkAPI) => {
    try {
      await client.mutate({
        mutation: BORROW_BOOK,
        variables: {
          id: +borrowBook.id,
        },
      });

      const res = await thunkAPI.dispatch(fetchBooks());

      return res.payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const returnBook = createAsyncThunk(
  "books/borrowBook",
  async (returnBook: { id: number }, thunkAPI) => {
    try {
      await client.mutate({
        mutation: RETURN_BOOK,
        variables: {
          id: +returnBook.id,
        },
      });

      const res = await thunkAPI.dispatch(fetchBooks());
      return res.payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    editBook: (state, action) => {
      state.books = state.books.map((book) => {
        if (book.id === action.payload.id) {
          book.name = action.payload.name;
          book.isbn = action.payload.isbn;
          book.author = action.payload.author;
          book.borrowedBy = null;
        }
        return book;
      });
    },
    removeBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      })
      .addCase(addNewBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewBook.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addNewBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      })
      .addCase(editBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBook.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      });
  },
});
export const { setBooks, addBook, removeBook } = booksSlice.actions;

export default booksSlice.reducer;

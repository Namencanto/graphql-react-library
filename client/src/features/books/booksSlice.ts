import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";

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

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    getBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getBooksSuccess: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
      state.loading = false;
      state.error = null;
    },
    getBooksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBookStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addBookSuccess: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addBookFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    editBookStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    editBookSuccess: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );
      state.books[index] = action.payload;
      state.loading = false;
      state.error = null;
    },
    editBookFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBookStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBookSuccess: (state, action: PayloadAction<number>) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    deleteBookFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

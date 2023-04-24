import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import { client } from "../../App";
import { GET_BOOKS } from "../../queries/bookQueries";
import { ADD_BOOK } from "../../mutations/bookMutations";

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
    const { data } = await client.query({ query: GET_BOOKS });
    console.log("data");
    return data.getAllBooks;
  } catch (error) {
    throw new Error("Something went wrong...");
  }
});

export const addNewBook = createAsyncThunk(
  "books/addNewBook",
  async (newBook: { name: string; author: string; isbn: number }) => {
    try {
      const response = await client.mutate({
        mutation: ADD_BOOK,
        variables: {
          name: newBook.name,
          author: newBook.author,
          isbn: newBook.isbn,
        },
      });
      return response.data.addBook as Book;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
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
        state.books = state.books.concat({
          id: action.payload.id,
          isbn: action.payload.isbn,
          name: action.payload.name,
          author: action.payload.author,
          borrowedBy: null,
        });
        state.loading = false;
        state.error = null;
      })
      .addCase(addNewBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      });
  },
});
// export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export default booksSlice.reducer;

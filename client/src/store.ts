import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import bookReducer from "./features/books/booksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { useDispatch } from "react-redux";

import Routes from "./routes/routes";
import "./index.css";
import { useEffect } from "react";
import { fetchUser } from "./features/auth/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchBooks } from "./features/books/booksSlice";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        books: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache,
  credentials: "include",
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
console.log(process.env.REACT_APP_GRAPHQL_URL);
function App() {
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

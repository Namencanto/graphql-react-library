import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { useDispatch } from "react-redux";

import Routes from "./routes/routes";
import "./index.css";
import { useEffect } from "react";
import { fetchUser } from "./features/auth/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

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
  uri: "http://localhost:3001/graphql",
  cache,
  credentials: "include",
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
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

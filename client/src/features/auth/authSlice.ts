import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { VERIFY_USER } from "../../queries/userQueries";
import { client } from "../../App";
import {
  DELETE_USER,
  LOGOUT_USER,
  UPDATE_USER,
} from "../../mutations/userMutations";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await client.mutate({ mutation: LOGOUT_USER });
    return null;
  } catch (error) {
    throw new Error("Something went wrong...");
  }
});

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  try {
    const { data } = await client.query({
      query: VERIFY_USER,
      fetchPolicy: "network-only",
    });
    return data.verifyUser;
  } catch (error) {
    throw new Error("Something went wrong...");
  }
});

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (user: { password: string }, thunkAPI) => {
    try {
      await client.mutate({
        mutation: DELETE_USER,
        variables: {
          password: user.password,
        },
      });
      return await thunkAPI.dispatch(logoutUser());
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    user: {
      login: string;
      name: string;
      password: string;
      newPassword: string;
    },
    thunkAPI
  ) => {
    try {
      await client.mutate({
        mutation: UPDATE_USER,
        variables: {
          login: user.login,
          name: user.name,
          password: user.password,
          newPassword: user.newPassword,
        },
      });
      return await thunkAPI.dispatch(fetchUser());
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong...";
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;

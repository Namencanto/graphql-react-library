import { Button, TextField, Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { LOGIN_USER } from "../../mutations/userMutations";
import { setUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

interface FormType {
  type: "user" | "admin";
}

const LoginForm: React.FC<FormType> = ({ type }) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  if (user) {
    navigate("/");
  }

  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [loginErrored, setLoginErrored] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErrored, setPasswordErrored] = useState(false);
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    if (!login) {
      setLoginErrored(true);
    } else {
      setLoginErrored(false);
    }
    if (!password) {
      setPasswordErrored(true);
    } else {
      setPasswordErrored(false);
    }

    try {
      const { data } = await loginUser({
        variables: { login, password, admin: type === "admin" },
      });

      if (data) {
        dispatch(setUser(data.loginUser));
        console.log(data.loginUser);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col h-screen gap-8">
      <h1 className="text-6xl">Librarium</h1>
      <div className="flex flex-col gap-2">
        <TextField
          label="Login"
          className="w-80"
          type="login"
          required
          helperText={loginErrored && "Please enter a valid login."}
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          error={loginErrored}
        />
        <TextField
          label="Password"
          type="password"
          className="w-80"
          required
          helperText={passwordErrored && "Password may not be empty."}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordErrored}
        />

        <div className="flex">
          <Link
            to="/signup"
            className="justify-self-start self-start mt-2 pr-4"
          >
            <MuiLink>Sign Up</MuiLink>
          </Link>
          <Link
            to={`/${type === "admin" ? "" : "admin-"}login`}
            className="justify-self-start self-start mt-2"
          >
            <MuiLink>{type === "admin" ? "User" : "Admin"} Panel</MuiLink>
          </Link>
        </div>
      </div>
      <Button
        variant="contained"
        className="w-80"
        onClick={handleLogin}
        disabled={loading}
      >
        <span className="p-1">{loading ? "Loading..." : "Login"}</span>
      </Button>
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default LoginForm;

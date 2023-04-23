import { useMutation } from "@apollo/client";
import { Button, TextField, Link as MuiLink } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ADD_USER } from "../../mutations/userMutations";

interface FormType {
  type: "user" | "admin";
}

const SignupForm: React.FC<FormType> = ({ type }) => {
  const [name, setName] = useState("");
  const [nameErrored, setNameErrored] = useState(false);

  const [login, setLogin] = useState("");
  const [loginErrored, setLoginErrored] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordErrored, setPasswordErrored] = useState(false);

  const [addUser, { loading, error }] = useMutation(ADD_USER);

  const handleSignup = async () => {
    if (!name) {
      setNameErrored(true);
    } else {
      setNameErrored(false);
    }

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

    // Call the mutation to add the user
    try {
      const result = await addUser({
        variables: {
          name: name,
          login: login,
          password: password,
          admin: type === "admin",
        },
      });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen gap-8">
      <h1 className="text-6xl">Librarium</h1>
      <div className="flex flex-col gap-2">
        <TextField
          label="Name"
          className="w-80"
          type="text"
          required
          helperText={nameErrored && "Please enter a valid name."}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={nameErrored}
        />
        <TextField
          label="Login"
          className="w-80"
          type="text"
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
          <Link to="/login" className="justify-self-start self-start mt-2 pr-4">
            <MuiLink>Login</MuiLink>
          </Link>
          <Link
            to={`/${type === "admin" ? "" : "admin-"}signup`}
            className="justify-self-start self-start mt-2"
          >
            <MuiLink>{type === "admin" ? "User" : "Admin"} Panel</MuiLink>
          </Link>
        </div>
      </div>
      <Button
        variant="contained"
        className="w-80"
        onClick={handleSignup}
        disabled={loading}
      >
        <span className="p-1">{loading ? "Loading..." : "Sign Up"}</span>
      </Button>
      {error && <p>{error.message}</p>}
    </div>
  );
};
export { SignupForm };

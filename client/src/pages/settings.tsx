import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack, MdSettings } from "react-icons/md";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, updateUser } from "../features/auth/authSlice";

const SettingsPage = () => {
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();
  const { user, loading, error } = useSelector((state: any) => state.auth);
  const [name, setName] = useState(user.name);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [serverAnswer, setServerAnswer] = useState("");

  const navigate = useNavigate();

  const handleDeleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(deleteUser({ password }));
      if (deleteUser.fulfilled.match(result)) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await dispatch(
        updateUser({ login, name, password, newPassword })
      );
      if (updateUser.fulfilled.match(result) && !loading) {
        setServerAnswer("Successfully edited user data");
      }
      setLogin("");
      setName("");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 dark:bg-gray-800 rounded-md shadow-md">
        <div className="flex items-center mb-6">
          <Link to="/">
            <MdArrowBack size={24} className="mr-2 text-white" />
          </Link>

          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <MdSettings size={24} className="ml-2 text-white" />
        </div>
        <form onSubmit={handleDeleteUser}>
          <div className="mb-4">
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={loading || !password}
            >
              <span className="p-1">
                {loading ? "Loading..." : "Delete Account"}
              </span>
            </Button>
          </div>
        </form>
        <form className="mt-6" onSubmit={handleUpdateUser}>
          <div className="mb-4">
            <TextField
              label="Login"
              variant="outlined"
              fullWidth
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Current Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              <span className="p-1">
                {loading ? "Loading..." : "Update account"}
              </span>
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {!error && serverAnswer.length > 0 && (
            <p className="text-green-500 mt-2">{serverAnswer}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

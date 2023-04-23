import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineLogout, HiPlusCircle } from "react-icons/hi";
import { FaBook } from "react-icons/fa";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { AiOutlineCrown } from "react-icons/ai";
import { logoutUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { GiBookshelf } from "react-icons/gi";

interface HeaderProps {
  username: string;
  admin: boolean;
}

const Header: React.FC<HeaderProps> = ({ username, admin }) => {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const logoutHandler = () => {
    dispatch(logoutUser());
  };
  return (
    <AppBar position="static" className="mb-4">
      <Toolbar className="justify-between">
        <Typography variant="h6" component="div" className="flex-grow">
          <div className="flex items-center">
            {username}'s Bookstore
            {admin && (
              <AiOutlineCrown className="ml-2 scale-[1.25] text-red-800" />
            )}
          </div>
        </Typography>
        <div className="flex gap-4 items-center">
          {admin || (
            <Link to="/my-books">
              <Button
                variant="contained"
                color="primary"
                startIcon={<GiBookshelf />}
                className="!bg-gray-600 !text-white hover:!bg-gray-500"
              >
                MY BOOKS
              </Button>
            </Link>
          )}
          {admin && (
            <Link to="/books-add">
              <Button
                variant="contained"
                color="primary"
                startIcon={<HiPlusCircle />}
                className="!bg-gray-600 !text-white hover:!bg-gray-500"
              >
                ADD NEW BOOK
              </Button>
            </Link>
          )}
          <Button
            color="inherit"
            startIcon={<HiOutlineLogout />}
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export { Header };

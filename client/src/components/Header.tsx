import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { FaBook } from "react-icons/fa";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <AppBar position="static" className="mb-4">
      <Toolbar className="justify-between">
        <Typography variant="h6" component="div" className="flex-grow">
          {username}'s Bookstore
        </Typography>
        <div className="flex gap-4">
          <Link to="/books">
            <IconButton color="inherit">
              <FaBook />
            </IconButton>
          </Link>
          <Button
            color="inherit"
            startIcon={<HiOutlineLogout />}
            // onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export { Header };

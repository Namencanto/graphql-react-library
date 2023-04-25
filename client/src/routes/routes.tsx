import React from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";
import AdminLoginPage from "../pages/admin-login";
import AdminSignupPage from "../pages/admin-signup";
import IndexPage from "../pages";
import NotFoundPage from "../pages/NotFound";
import BooksAddPage from "../pages/books-add";
import BooksEditPage from "../pages/books-edit";
import SettingsPage from "../pages/settings";
import { useSelector } from "react-redux";

const Routes: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <ReactRouterRoutes>
      <Route path="/" element={<IndexPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="admin-login" element={<AdminLoginPage />} />
      <Route path="admin-signup" element={<AdminSignupPage />} />

      {user && (
        <>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="books-add" element={<BooksAddPage />} />
          <Route path="books-edit/:id" element={<BooksEditPage />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </ReactRouterRoutes>
  );
};

export default Routes;

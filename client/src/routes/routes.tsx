import React from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";
import AdminLoginPage from "../pages/admin-login";
import AdminSignupPage from "../pages/admin-signup";
import IndexPage from "../pages";

const Routes: React.FC = () => {
  return (
    <ReactRouterRoutes>
      <Route path="" element={<IndexPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="admin-login" element={<AdminLoginPage />} />
      <Route path="admin-signup" element={<AdminSignupPage />} />
    </ReactRouterRoutes>
  );
};

export default Routes;

// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
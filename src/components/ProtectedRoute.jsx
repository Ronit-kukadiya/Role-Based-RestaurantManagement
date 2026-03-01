import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const naviagte = useNavigate();
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!isAuthenticated) {
    naviagte("/");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.data?.UserRole)) {
    naviagte("/");
  }
  return children;
};

export default ProtectedRoute;

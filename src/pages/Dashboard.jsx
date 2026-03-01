import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;

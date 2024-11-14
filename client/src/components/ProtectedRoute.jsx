import React, { useEffect } from "react";
import Cookie from "js-cookie";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = Cookie.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]);

  // If the user is authenticated, render the nested routes(<Outlet/>), otherwise nothing (or redirect)
  return token ? <Outlet /> : null;
};

export default ProtectedRoute;

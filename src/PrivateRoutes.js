import { Outlet, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AppContext from "./components/AppContext";

const PrivateRoutes = () => {
  let { user, test } = useContext(AppContext);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
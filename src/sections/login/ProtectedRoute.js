import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import Navbar from "../nav/nav";
import Sidebar from "../sidebar/sidebar";

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') );
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if (user.role==="admin") {
  //   return <Navigate to="/unauth" replace />;
  // }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default ProtectedLayout;
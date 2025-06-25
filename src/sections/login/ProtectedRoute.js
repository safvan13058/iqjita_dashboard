import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import Navbar from "../nav/nav";
import Sidebar from "../sidebar/sidebar";

function ProtectedLayout({allowedRoles}) {
  const { isAuthenticated } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') );
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!["admin", "administrator", "superadmin","Human_Resources","Sales","Marketing","Management","Academics"].includes(user.role)) {
    return <Navigate to="/unauth" replace />;
  }
   if (['Human_Resources'].includes(user.role)) {
    return <Navigate to="/hr" replace />;
  }
   if (["Sales","Marketing","Management","Academics"].includes(user.role)) {
    return <Navigate to="/faculty" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/are_you_fool"  replace />;
  }
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main-content" style={{ marginLeft: "250px", padding: "20px", paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default ProtectedLayout;
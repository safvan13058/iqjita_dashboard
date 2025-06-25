import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Bottombar from '../bottombar/bottombar';
import Nav from '../nav/nav';
import { useAuth } from '../../sections/login/auth';

const FacLayout = ({ allowedRoles}) => {
  const { isAuthenticated } = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!isAuthenticated) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role) {
    // No user or role found, block access
    return <Navigate to="/unauth" replace />;
  }

  const role = user.role.toLowerCase();

  if (!["sales","marketing","management","academics"].includes(role)) {
    // Role not in general allowed list
    return <Navigate to="/unauth" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    // Role is not allowed for this specific area
    return <Navigate to="/are_you_fool" replace />;
  }

  return (
    <div style={{marginTop:65}}>
      <Nav />
      <Bottombar />
      <div
        className=""
      >
        <Outlet />
      </div>
    </div>
  );
};

export default FacLayout;

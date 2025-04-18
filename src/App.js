// import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./sections/login/auth";
import React, { useState, useEffect } from "react";

import "./App.css";
import "./mediascreen/mediascreen.css";
import Sidebar from "./sections/sidebar/sidebar";
import "../src/sections/common/colour.css";
import Navbar from "./sections/nav/nav";
import Home from "./sections/home/home";
import StudentsPage from "./sections/students/students";
import AdmissionForm from "./sections/admission/admission";
import FeeForm from "./sections/fees/fees";
import CourseForm from "./sections/course/course";
import Login from "./sections/login/login";
import ProtectedRoute from "./sections/login/ProtectedRoute";
import UnderConstruction from "./sections/Erorr/under_building";
import UnauthorizedPage from "./sections/Erorr/unauthorized/Unauthorized";
import LoadingPage from "./sections/loading/loading";
import Pending from "./sections/pending_fee/pending";
import Account from "./sections/accounts/account";
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage />; // 👈 your custom loading screen
  }
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauth" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/faculty" element={<UnderConstruction />} />
            <Route path="/sales" element={<UnderConstruction />} />
            {/* <Route path="/accounts" element={<Account />} /> */}
           <Route path="/are_you_fool" element={<UnauthorizedPage />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/fee-payment" element={<FeeForm />} />
            <Route path="/course" element={<CourseForm />} />
            <Route path="/alumni" element={<UnderConstruction />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
            <Route path="/accounts" element={<Account />} />
          </Route>

          {/* Redirect all other paths to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
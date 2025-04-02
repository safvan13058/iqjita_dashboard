import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./sections/login/auth";

import "./App.css";
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/faculty" element={<h1>👨‍🏫 Faculty Page</h1>} />
            <Route path="/sales" element={<h1>💰 Sales Page</h1>} />
            <Route path="/accounts" element={<h1>📊 Accounts Page</h1>} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/fee-payment" element={<FeeForm />} />
            <Route path="/course" element={<CourseForm />} />
            <Route path="/alumni" element={<h1>📊 Alumni Page</h1>} />
          </Route>
          
          {/* Redirect all other paths to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
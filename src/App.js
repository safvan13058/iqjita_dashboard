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

import BodyBackgroundHandler from './human_resource/hr_layout/BodyBackgroundHandler';
import HrLayout from "./human_resource/hr_layout/hr_layout";
import HrDashboard from "./human_resource/dashboard/dashboard";
import EmployeePage from "./human_resource/employees/employee";
import AttendanceTable from "./human_resource/attendence/attendence";
import LeaveTable from "./human_resource/Leave/leave";
import PayrollTable from "./human_resource/Payroll/payroll";
import EmployeeDetails from "./human_resource/single_emp/single_emp"
import EmployeePerformance from "./human_resource/Performance/performance";
import Calendar from "./human_resource/calendar/calendar";
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
        <BodyBackgroundHandler /> 
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauth" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/pending" element={<Pending />} />
             <Route path="/faculty" element={<Navigate to="/hr" />} />
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

          <Route path="/hr" element={<HrLayout allowedRoles={['admin', 'superadmin','Human Resource']} />}>
            <Route index element={<HrDashboard />} />
            <Route path="employees" element={<EmployeePage/>} />
            <Route path="attendance" element={<AttendanceTable />} />
            <Route path="Leave" element={<LeaveTable/>} />
            <Route path="Payroll" element={<PayrollTable/>} />
            <Route path="Performance" element={<EmployeePerformance/>} />
            <Route path="Expense" element={<Calendar/>} />
           <Route path="employee/:id" element={<EmployeeDetails />} />  
            {/* add more HR routes here */}
          </Route>

          {/* Redirect all other paths to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
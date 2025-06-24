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
import UserTable from "./sections/usermanage/usermanage";
import AnnouncementPanel from "./sections/announcement/announcement"
import AlumniStudentsPage from "./sections/alumni/alumni";

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
import MailPage from "./human_resource/mailbox/mailbox";
import EXEmployeePage from "./human_resource/ex_emp/exemp";


import FacLayout from "./faculty/layout/faclayout"
import FacHome from "./faculty/home/home"
import AttendancePage from "./faculty/attendence/attendence"
import EmployeeProfile from "./faculty/profile/profile"
import SalaryPage from "./faculty/salary_page/salarypage"
import NotificationsPage from "./faculty/notifications/notification"
import FacultyLeavePage from "./faculty/leaveapply/leave"
import AllLeavePage from "./faculty/leaveapply/allleave"
import MarketingBannerPage from "./faculty/marketing/staffmarketing/staffmark"
import StuMarketingBannerPage from "./faculty/marketing/studentmarketing/studentsmark"


import StuLayout from "./students/studlayout/stulayout"
import StuHome from "./students/home/home"
import StudentsProfile from "./students/profile/profile";
import StuNotificationsPage from "./students/notification/notification"
import FeePaymentPage from "./students/feepayment/feepayment"
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
            <Route path="/hrhr" element={<Navigate to="/hr" />} />
            <Route path="/sales" element={<UnderConstruction />} />
            {/* <Route path="/accounts" element={<Account />} /> */}
            <Route path="/are_you_fool" element={<UnauthorizedPage />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/fee-payment" element={<FeeForm />} />
            <Route path="/course" element={<CourseForm />} />
            <Route path="/alumni" element={<AlumniStudentsPage />} />
            <Route path="/AnnouncementPanel" element={<AnnouncementPanel />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
            <Route path="/accounts" element={<Account />} />
            <Route path="/usermanage" element={<UserTable />} />
          </Route>

          <Route path="/hr" element={<HrLayout allowedRoles={['admin', 'superadmin', 'human_resources']} />}>
            <Route index element={<HrDashboard />} />
            <Route path="employees" element={<EmployeePage />} />
            <Route path="exemployees" element={<EXEmployeePage />} />

            <Route path="attendance" element={<AttendanceTable />} />
            <Route path="Leave" element={<LeaveTable />} />
            <Route path="Payroll" element={<PayrollTable />} />
            <Route path="Performance" element={<EmployeePerformance />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="mailbox" element={<MailPage />} />
            <Route path="employee/:id" element={<EmployeeDetails />} />
            {/* add more HR routes here */}
          </Route>

          <Route path="/faculty" element={<FacLayout allowedRoles={['admin', 'superadmin', 'human_resources']} />}>
            <Route index element={<FacHome />} />
            <Route path="home" element={<EmployeePage />} />
            <Route path="attendence" element={<AttendancePage />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="SalaryPage" element={<SalaryPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="LeavePage" element={<FacultyLeavePage />} />
            <Route path="all-leaves" element={<AllLeavePage />} />
            <Route path="staffmarketing" element={<MarketingBannerPage />} />
            <Route path="stumarketing" element={< StuMarketingBannerPage />} />

            {/* add more HR routes here */}
          </Route>
          <Route path="/students" element={<StuLayout allowedRoles={['admin', 'superadmin', 'human_resources']} />}>
            <Route index element={<StuHome />} />
            <Route path="profile" element={<StudentsProfile />} />
            <Route path="fees" element={<FeePaymentPage />} />
            <Route path="notification" element={<StuNotificationsPage />} />
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
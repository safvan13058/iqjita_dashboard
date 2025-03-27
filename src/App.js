import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./sections/sidebar/sidebar";
import "../src/sections/common/colour.css";
import Navbar from "./sections/nav/nav";
import Home from "./sections/home/home";
import StudentsPage from "./sections/students/students";
import AdmissionForm from "./sections/admission/admission";
import FeeForm from "./sections/fees/fees";
import CourseForm from "./sections/course/course";
function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />

      {/* Main Content with Sidebar Space */}
      <div style={{ marginLeft: "250px", padding: "20px", paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/faculty" element={<h1>👨‍🏫 Faculty Page</h1>} />
          <Route path="/sales" element={<h1>💰 Sales Page</h1>} />
          <Route path="/accounts" element={<h1>📊 Accounts Page</h1>} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/fee-payment" element={<FeeForm />} />
          <Route path="/course" element={<CourseForm />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./profile.css";

const employee = {
  photo: "https://via.placeholder.com/140",
  name: "Aarav Mehta",
  empId: "EMP245",
  dob: "1991-12-10",
  department: "Development",
  designation: "Senior Developer",
  performance: [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 85 },
    { month: "Mar", score: 90 },
    { month: "Apr", score: 87 },
    { month: "May", score: 92 }
  ]
};

const EmployeeProfile = () => {
  return (
    <div className="employee-profile-container">
      <div className="employee-profile-card">
        <div className="employee-profile-header">
          <img src={employee.photo} alt="Employee" className="employee-profile-photo" />
          <div className="employee-profile-details">
            <h2>{employee.name}</h2>
            <p><strong>Employee ID:</strong> {employee.empId}</p>
            <p><strong>DOB:</strong> {employee.dob}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Designation:</strong> {employee.designation}</p>
          </div>
        </div>
        <div className="employee-profile-performance">
          <h3>Performance Graph</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={employee.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0F6D66" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

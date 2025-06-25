import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./profile.css";

const EmployeeProfile = () => {
  const [employeeData, setEmployeeData] = useState(null);

  const employeeID = JSON.parse(localStorage.getItem('user'))?.username;

  useEffect(() => {
     if (employeeID) {
      fetch(`https://software.iqjita.com/employee_full_data.php?action=full_profile&employee_id=${employeeID}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.employee) {
            setEmployeeData(data.employee);
          } else {
            console.error("Invalid employee data from API");
          }
        })
        .catch(err => console.error("API error:", err));
    }
  }, [employeeID]);

  if (!employeeData) {
    return <div className="employee-profile-container">Loading profile...</div>;
  }

  return (
    <div className="employee-profile-container">
      <div className="employee-profile-card">
        <div className="employee-profile-header">
          <img
            src={employeeData.ProfileImage || "https://via.placeholder.com/140"}
            alt="Employee"
            className="employee-profile-photo"
          />
          <div className="employee-profile-details">
            <h2>{employeeData.FullName}</h2>
            <p><strong>Employee ID:</strong> {employeeID}</p>
            <p><strong>DOB:</strong> {employeeData.DateOfBirth}</p>
            <p><strong>Department:</strong> {employeeData.Department}</p>
            <p><strong>Designation:</strong> {employeeData.Designation}</p>
          </div>
        </div>

        <div className="employee-profile-performance">
          <h3>Performance Graph</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={employeeData.Performance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0F6D66"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

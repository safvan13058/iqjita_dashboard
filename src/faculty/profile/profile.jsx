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
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const employeeID = JSON.parse(localStorage.getItem('user'))?.username;
console.log("emp--id==1",employeeID)
console.log("emp--id==2",JSON.parse(localStorage.getItem('user')).username)
  useEffect(() => {
    if (!employeeID) return;

    // Fetch employee details
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
  }, [employeeID]);

  useEffect(() => {
  if (!employeeID) return;

  setLoading(true);

  fetch(`https://software.iqjita.com/hr/perfomancegraph_emp.php?employee_id=${employeeID}`)
    .then((res) => res.json())
    .then((data) => {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      console.log(data)
      // Sort API data based on correct month order
      const sorted = data.sort((a, b) => {
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

      // Take last 6 entries
      const last6 = sorted.slice(-6).map(item => ({
        month: item.month,
        score: parseInt(item.total_score)
      }));
      console.log(last6)

      setPerformanceData(last6);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load performance data", err);
      setLoading(false);
    });
}, [employeeID]);



  if (!employeeID) {
    return <div className="employee-profile-container">No employee ID found.</div>;
  }

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
          <h3>Performance Graph (Last 6 Months)</h3>
          {loading ? (
            <p>Loading performance graph...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0F6D66"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

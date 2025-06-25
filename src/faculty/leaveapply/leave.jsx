import React, { useState, useEffect } from "react";
import "./leave.css";
import { useNavigate } from 'react-router-dom';

const FacultyLeavePage = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    category: ""
  });

  const employeeId = JSON.parse(localStorage.getItem('user'))?.username; // Replace with dynamic employee ID (e.g., from context/login)
   
  // 📥 Fetch leaves for this employee
 const fetchLeaves = () => {
  fetch(`https://software.iqjita.com/hr/leave_api.php?action=list&employee_id=${employeeId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const firstThree = data.slice(0, 3); // Only first 3 leave entries
        setLeaves(firstThree);
        console.log("Leaves fetched:", data);
      }
    })
    .catch(err => console.error("Failed to fetch leaves:", err));
};
useEffect(() => {
  fetchLeaves();
}, []);


  // 📝 Handle input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 📤 Submit new leave
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason || !formData.category) return;

    const payload = {
      action: "create",
      employee_id: employeeId,
      leave_type: formData.category,
      start_date: formData.startDate,
      end_date: formData.endDate,
      reason: formData.reason
    };

    fetch("https://software.iqjita.com/hr/leave_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Leaves fetched:", data);
          // Add newly submitted leave to list
         
         fetchLeaves();
          setFormData({ startDate: "", endDate: "", reason: "", category: "" });
          

        } else {
          alert(data.message || "Error submitting leave");
        }
      })
      .catch(err => console.error("Submission error:", err));
  };

  return (
    <div className="faculty-leave-container">
      <h2 className="faculty-leave-title">Apply for Leave</h2>

      <form className="faculty-leave-form" onSubmit={handleSubmit}>
        <div className="leave-date">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Personal Leave">Personal Leave</option>
          <option value="Casual Leave">Casual Leave</option>
        </select>

        <label>Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          required
        />

        <button type="submit" className="faculty-btn-primary">Submit Leave</button>
      </form>

      <div className="faculty-leave-header">
        <h3 className="faculty-leave-subtitle">Your Leave Applications</h3>
        <button className="see-all-btn" onClick={() => navigate("/faculty/all-leaves")}>
          See All
        </button>
      </div>

      <div className="faculty-leave-cards">
        {leaves.length === 0 ? (
          <p className="faculty-no-leave">No leave applications yet.</p>
        ) : (
          leaves.map((leave) => (
            <div key={leave.LeaveID} className="faculty-leave-card">
              <div>
                <p><strong>From:</strong> {leave.StartDate}</p>
                <p><strong>To:</strong> {leave.EndDate}</p>
                <p><strong>Reason:</strong> {leave.Reason}</p>
              </div>
              <div className={`faculty-leave-status ${leave.Status.toLowerCase()}`}>
                {leave.Status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyLeavePage;

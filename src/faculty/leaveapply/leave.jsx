import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) return;

    const newLeave = {
      id: Date.now(),
      ...formData,
      status: "Pending"
    };
    setLeaves([newLeave, ...leaves]);
    setFormData({ startDate: "", endDate: "", reason: "" });
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
            <div key={leave.id} className="faculty-leave-card">
              <div>
                <p><strong>From:</strong> {leave.startDate}</p>
                <p><strong>To:</strong> {leave.endDate}</p>
                <p><strong>Reason:</strong> {leave.reason}</p>
              </div>
              <div className={`faculty-leave-status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyLeavePage;

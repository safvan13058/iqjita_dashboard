import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllLeavesPage.css'; // Make sure this CSS file exists
import { BiCheckDouble } from "react-icons/bi";
const AllLeavesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [leaves, setLeaves] = useState([]);

  const employeeId = JSON.parse(localStorage.getItem('user'))?.username; // ✅ Replace with dynamic user ID from login or context

  useEffect(() => {
    fetch(`https://software.iqjita.com/hr/leave_api.php?action=list&employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeaves(data);
        } else if (data.success && Array.isArray(data.leaves)) {
          console.log(data)
          setLeaves(data.leaves);
        }
      })
      .catch(err => {
        console.error("Error fetching leaves:", err);
      });
  }, [employeeId]);

  const filteredLeaves = filter === 'All'
    ? leaves
    : leaves.filter(leave => leave.Status === filter); // Ensure Status matches your DB column

  return (
    <div className="all-leaves-container">
      <div className="all-leaves-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <h2>All Leave Applications</h2>
      </div>

      <div className="status-bar">
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            className={`status-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>



      <div className="leave-cards">
        {filteredLeaves.map(leave => (
          <div key={leave.LeaveID} className={`leave-card ${leave.Status.toLowerCase()}`}>

            {/* Double Tick Icon in top-right corner */}
            <div className="read-icon">
              <BiCheckDouble
                size={20}
                color={leave.IsRead === "1" ? 'blue' : 'gray'}
                title={leave.IsRead === "1" ? 'Read' : 'Unread'}
              />
            </div>

            <h4>{leave.LeaveType || 'Leave'}</h4>
            <p><strong>From:</strong> {leave.StartDate}</p>
            <p><strong>To:</strong> {leave.EndDate}</p>
            <p><strong>Reason:</strong> {leave.Reason}</p>
            {leave.Remark && (
              <p className="remark-text"><strong>Remark:</strong> {leave.Remark}</p>
            )}

            <span className={`status ${leave.Status.toLowerCase()}`}>{leave.Status}</span>
          </div>
        ))}
        {filteredLeaves.length === 0 && (
          <p className="no-data">No leave applications found.</p>
        )}
      </div>
    </div>
  );
};

export default AllLeavesPage;

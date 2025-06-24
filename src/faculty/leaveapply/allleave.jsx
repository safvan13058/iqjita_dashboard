import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllLeavesPage.css'; // CSS styling

const dummyLeaves = [
  { id: 1, type: 'Sick Leave', date: '2025-06-22', status: 'Pending' },
  { id: 2, type: 'Casual Leave', date: '2025-06-20', status: 'Approved' },
  { id: 3, type: 'Personal Leave', date: '2025-06-18', status: 'Rejected' },
  { id: 4, type: 'Sick Leave', date: '2025-06-15', status: 'Pending' },
];

const AllLeavesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredLeaves = filter === 'All'
    ? dummyLeaves
    : dummyLeaves.filter(leave => leave.status === filter);

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
          <div key={leave.id} className={`leave-card ${leave.status.toLowerCase()}`}>
            <h4>{leave.type}</h4>
            <p>Date: {leave.date}</p>
            <span className={`status ${leave.status.toLowerCase()}`}>{leave.status}</span>
          </div>
        ))}
        {filteredLeaves.length === 0 && <p className="no-data">No leaves found.</p>}
      </div>
    </div>
  );
};

export default AllLeavesPage;

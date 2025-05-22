import React, { useState } from 'react';
import './leave.css';

const leaveData = [
  { name: 'John Doe', reason: 'Sick Leave', date: '2025-05-14', status: 'approved' },
  { name: 'Jane Smith', reason: 'Personal', date: '2025-05-12', status: 'approved' },
];

const LeaveTable = () => {
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  const filteredData = leaveData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (leave) => {
    setSelectedLeave(leave);
  };

  const closeModal = () => {
    setSelectedLeave(null);
  };

  const handleStatusChange = (status) => {
    // Example logic: You can send this to a backend or update UI
    console.log(`Leave ${status}:`, selectedLeave);
    console.log("Remarks:", remarks);

    // Close the modal after action
    closeModal();
  };


  return (
    <>
      <h2 className='hr-title'>Leave Approval</h2>

      <input
        type="text"
        className="leavetable-search-input"
        placeholder="Search by Name or Reason"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="leavetable-container">
        <table className="leavetable-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'leavetable-row' : 'leavetable-row-alt'}>
                  <td>{item.name}</td>
                  <td>{item.reason}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="leavetable-action-btn"
                      onClick={() => openModal(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedLeave && (
       <div className="hrleave-modal-overlay" onClick={closeModal}>
  <div className="hrleave-modal" onClick={(e) => e.stopPropagation()}>
    <h3 className="hrleave-heading hr-text-heading">Leave Details</h3>

    <p className="hrleave-info hr-text-primary">
  <label>
    <span>Name:</span>
    <input type="text" value={selectedLeave.name} readOnly className="hrleave-display-input" />
  </label>
</p>

<p className="hrleave-info hr-text-primary leavedate">
  <div >
     <label>
    <span>Starting Date:</span>
    <input type="text" value={selectedLeave.date} readOnly className="hrleave-display-input" />
  </label>
  </div>
  <div>
     <label>
    <span>Ending Date:</span>
    <input type="text" value={selectedLeave.date} readOnly className="hrleave-display-input" />
  </label>
  </div>
 
 
</p>

<p className="hrleave-info hr-text-primary">
  <label>
    <span>Status:</span>
    <input type="text" value={selectedLeave.status} readOnly className="hrleave-display-input" />
  </label>
</p>

<p className="hrleave-info hr-text-primary">
  <label>
    <span>Reason:</span>
    <input type="text" value={selectedLeave.reason} readOnly className="hrleave-display-input" />
  </label>
</p>


    <div className="hrleave-remark-group">
      <label className="hrleave-label hr-text-secondary" htmlFor="remarks">Remarks (optional)</label>
      <textarea
        className="hrleave-input"
        id="remarks"
        placeholder="Enter remarks here..."
        rows="3"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      ></textarea>
    </div>

    <div className="hrleave-button-group">
      <button className="hrleave-button hrleave-approve-btn hr-text-light" onClick={() => handleStatusChange("Approved")}>Approve</button>
      <button className="hrleave-button hrleave-reject-btn hr-text-light" onClick={() => handleStatusChange("Rejected")}>Reject</button>
      <button className="hrleave-button hrleave-close-btn hr-text-light" onClick={closeModal}>Close</button>
    </div>
  </div>
</div>



      )}
    </>
  );
};

export default LeaveTable;

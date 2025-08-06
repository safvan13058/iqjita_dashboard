import React, { useState, useEffect } from 'react';
import './leave.css';

const LeaveTable = () => {
  const [leaves, setLeaves] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch leave list from API
  const fetchLeaves = () => {
    fetch("https://software.iqjita.com/hr/leave_api.php?action=list_all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeaves(data);
        } else if (data.success && Array.isArray(data.leaves)) {
          setLeaves(data.leaves);
        }
      })
      .catch(err => console.error("Error fetching leaves:", err));
  };

  useEffect(() => {
    fetchLeaves(); // call on first render
  }, []);

  // Filtered leaves
  const filteredData = leaves.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (leave) => {
     if (leave.IsRead !== "1") {
    fetch(`https://software.iqjita.com/hr/leave_api.php?action=mark_as_read&leave_id=${leave.LeaveID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ leave_id: leave.LeaveID }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Optionally update UI state if needed
          leave.IsRead = "1"; // Only works if item is from a stateful array
        }
      })
      .catch(err => console.error("Error marking leave as read", err));
  }
    setSelectedLeave(leave);
    fetchLeaves()
    setRemarks(leave.Remark || '');
  };

  const closeModal = () => {
     fetchLeaves()
    setSelectedLeave(null);
    setRemarks('');
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedLeave?.LeaveID) return;

    fetch("https://software.iqjita.com/hr/leave_api.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        leave_id: selectedLeave.LeaveID,
        status: newStatus,
        remark: remarks
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(data)
          const updated = leaves.map(leave =>
            leave.LeaveID === selectedLeave.LeaveID
              ? { ...leave, Status: newStatus, Remark: remarks }
              : leave
          );
          setLeaves(updated);
          fetchLeaves()
          closeModal();
        } else {
          alert("Update failed");
        }
      })
      .catch(err => console.error("Update error:", err));
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
              <th>Emp-Id</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'leavetable-row' : 'leavetable-row-alt'}>
                  <td> {item.IsRead !== "1" && <span className="unread-dot-inline" />}{item.EmployeeName}</td>
                  <td>{item.EmployeeID}</td>
                  <td>{item.StartDate}</td>
                  <td>{item.EndDate}</td>
                  <td>{item.Status}</td>
                  <td>
                    <button className="leavetable-action-btn" onClick={() => openModal(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '15px' }}>
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
                <input type="text" value={selectedLeave.EmployeeName} readOnly className="hrleave-display-input" />
              </label>
            </p>

            <p className="hrleave-info hr-text-primary leavedate">
              <div>
                <label>
                  <span>Start Date:</span>
                  <input type="text" value={selectedLeave.StartDate} readOnly className="hrleave-display-input" />
                </label>
              </div>
              <div>
                <label>
                  <span>End Date:</span>
                  <input type="text" value={selectedLeave.EndDate} readOnly className="hrleave-display-input" />
                </label>
              </div>
            </p>

            <p className="hrleave-info hr-text-primary">
              <label>
                <span>Status:</span>
                <input type="text" value={selectedLeave.Status} readOnly className="hrleave-display-input" />
              </label>
            </p>

            <p className="hrleave-info hr-text-primary">
              <label>
                <span>Reason:</span>
                <input type="text" value={selectedLeave.Reason} readOnly className="hrleave-display-input" />
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

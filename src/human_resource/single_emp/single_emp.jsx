import React, { useState, useEffect,useRef } from 'react';
import './single_emp.css';
import { useParams, useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [machineEmployeeID, setMachineEmployeeID] = useState('');
  const [connectedMachineID, setConnectedMachineID] = useState(null);

  // const [machineEmployeeID, setMachineEmployeeID] = useState("");
  const [unmappedMachines, setUnmappedMachines] = useState([]);
const fileInputRef = useRef(null);

const handleProfileUploadClick = () => {
  fileInputRef.current.click();
};

 const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !employee.EmployeeID) return;

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("EmployeeID", employee.EmployeeID);

    try {
      const response = await fetch("https://software.iqjita.com/hr/updateprofile.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Profile image updated!");
        // Optionally refresh image or state
        fetchEmployee()// or update state to reflect new image
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  };
  useEffect(() => {
    if (showConnectModal) {
      // Fetch unmapped machines
      fetch("https://software.iqjita.com/hr/attendencemapping.php")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setUnmappedMachines(data.data);
            if (data.data.length > 0) {
              setMachineEmployeeID(data.data[0].MachineEmployeeID);
            }
          } else {
            setUnmappedMachines([]);
          }
        })
        .catch(() => setUnmappedMachines([]));

      // Fetch current machine mapping
      fetch(`https://software.iqjita.com/hr/employee_mapping.php?EmployeeID=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success" && data.data?.MachineEmployeeID) {
            setConnectedMachineID(data.data.MachineEmployeeID);
          } else {
            setConnectedMachineID(null);
          }
        })
        .catch(() => setConnectedMachineID(null));
    }
  }, [showConnectModal, id]);


  const handleconnectatt = () => {
    setShowConnectModal(true);
  };
  const handleDeleteConnection = async () => {
    if (!window.confirm("Are you sure you want to delete this connection?")) return;

    try {
      const response = await fetch(`https://software.iqjita.com/hr/employee_mapping.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EmployeeID: id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Connection deleted.");
        setConnectedMachineID(null);
        setShowConnectModal(false);
      } else {
        alert(result.message || "Failed to delete.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };


  const handleConnectSubmit = async () => {
    const response = await fetch('https://software.iqjita.com/hr/employee_mapping.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EmployeeID: employee.EmployeeID,         // Replace with actual employee ID from props/state
        MachineEmployeeID: machineEmployeeID,
      }),
    });

    const data = await response.json();
    console.log(data); // Handle success or failure messages
    setShowConnectModal(false); // Close modal after submit
  };
useEffect(() => {
    fetchEmployee();
  }, [id]);
 
    const fetchEmployee = async () => {
      const response = await fetch(`https://software.iqjita.com/hr/employee.php?action=read_single&EmployeeID=${id}`);
      const result = await response.json();
      if (result.status === 'success') {
        const data = result.data;
        const formatted = {
          ...data,
          ImageURL: data.ProfileImage,
          BankName: data.BankDetails?.BankName,
          BankBranchName: data.BankDetails?.BranchName,
          AccountNumber: data.BankDetails?.AccountNumber,
          IFSCCode: data.BankDetails?.IFSCCode,
          AccountType: data.BankDetails?.AccountType,
          NetSalaryHourly: data.SalaryDetails?.NetSalaryHourly,
          NetSalaryDaily: data.SalaryDetails?.NetSalaryDaily,
          NetSalaryMonthly: data.SalaryDetails?.NetSalaryMonthly
        };
        setEmployee(formatted);
      }
    };
   

  const handleEditClick = () => {
    setIsEditMode(true);
    setFormData(employee);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const payload = new FormData();
    payload.append("action", "update");
    payload.append("EmployeeID", id);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        payload.append(key, value);
      }
    });

    const response = await fetch(`https://software.iqjita.com/hr/employee.php?action=update`, {
      method: "POST",
      body: payload,
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert("Updated successfully");
      setIsEditMode(false);
      setEmployee(formData); // update UI
    } else {
      alert("Update failed: " + result.message);
    }
  };

  const renderEditableField = (label, key) => (
    <div className="hr-detail-row">
      <div className="hr-detail-label">{label}</div>
      <div className="hr-detail-value">
        {isEditMode ? (
          <input
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="hr-input-field"
          />
        ) : (
          employee[key] || '-'
        )}
      </div>
    </div>
  );

  if (!employee) {
    return (
      <>
        <p className="hr-loading-text">Loading employee...</p>
        <div className="hr-back-button-container">
          <div className="hr-btn-back" onClick={() => navigate(-1)}>←</div>
        </div>
      </>
    );
  }

  return (
    <div className="hr-page-container">
      <div className="hr-card hr-employee-details">
        <div className="hr-back-button-container">
          <div className="hr-btn-back" onClick={() => navigate(-1)}>←</div>
        </div>
        <div className="hr-header">
          <div className='hr-header-contact'>
            <div className="img-profile" style={{ position: "relative", display: "inline-block" }}>
              <img
                src={employee.ImageURL || "/default-profile.png"}
                alt="Employee"
                className="hr-profile-imgs-emp"              
              />

              <button
                className="edit-profile-btn"
                onClick={handleProfileUploadClick}
                title="Edit Profile"
              >
                ✎
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleProfileUpload}
              />
            </div>

            <div className="hr-info">
              <h2 className="hr-heading">{employee.FullName}</h2>
              <p className="hr-subheading">{employee.Designation} | {employee.Department}</p>
              <p className="hr-branch">Branch: {employee.BranchName}</p>
            </div>
          </div>
          <div className='hr-header-actions'>

            {isEditMode ? (
              <>
                <button className="hr-btn hr-btn-secondary" onClick={handleCancel}>Cancel</button>
                <button className="hr-btn hr-btn-primary" onClick={handleUpdate}>Save</button>
              </>
            ) : (
              <>
                <button className="hr-btn hr-btn-primary" onClick={handleEditClick}>Edit details</button>
                <button className="hr-btn hr-btn-primary" onClick={handleconnectatt}>Connect Attendence</button>
              </>
            )}
          </div>
        </div>
        {showConnectModal && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <h3>Connect Attendance</h3>

              {connectedMachineID ? (
                <>
                  <p style={{ color: 'white' }}>
                    This employee is already connected to <strong style={{ color: 'white' }}>Machine ID :{connectedMachineID}</strong>
                  </p>

                  <div className="modal-actions">
                    <button
                      className="hr-btn hr-btn-primary"
                      onClick={() => handleDeleteConnection(employee.EmployeeID)}
                    >
                      Delete Connection
                    </button>
                    <button
                      className="hr-btn hr-btn-secondary"
                      onClick={() => setShowConnectModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label>Machine Employee ID</label>
                  <select
                    value={machineEmployeeID}
                    onChange={(e) => setMachineEmployeeID(e.target.value)}
                    className="hr-input"
                  >
                    {unmappedMachines.length === 0 ? (
                      <option value="">No unmapped machines available</option>
                    ) : (
                      unmappedMachines.map(({ MachineEmployeeID }) => (
                        <option key={MachineEmployeeID} value={MachineEmployeeID}>
                          {MachineEmployeeID}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="modal-actions">
                    <button
                      className="hr-btn hr-btn-secondary"
                      onClick={() => setShowConnectModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="hr-btn hr-btn-primary"
                      onClick={() => handleConnectSubmit(machineEmployeeID)}
                      disabled={!machineEmployeeID}
                    >
                      Connect
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <h3 className="hr-subsection-heading">Employee Info</h3>
        <div className="hr-details-grid">
          {renderEditableField("Emp-ID", "EmployeeID")}
          {renderEditableField("Email", "Email")}
          {renderEditableField("Phone", "PhoneNumber")}
          {renderEditableField("Joining Date", "JoiningDate")}
          {renderEditableField("Date of Birth", "DateOfBirth")}
          {renderEditableField("Address", "Address")}
          {renderEditableField("Emergency Contact", "EmergencyContact")}
          {renderEditableField("Education", "Education")}
          {renderEditableField("Certificates", "Certificates")}
          {renderEditableField("Branch", "BranchName")}
        </div>

        <h3 className="hr-subsection-heading">Salary Info</h3>
        <div className="hr-details-grid">
          {renderEditableField("Hourly Salary", "NetSalaryHourly")}
          {renderEditableField("Daily Salary", "NetSalaryDaily")}
          {renderEditableField("Monthly Salary", "NetSalaryMonthly")}
        </div>

        <h3 className="hr-subsection-heading">Bank Info</h3>
        <div className="hr-details-grid">
          {renderEditableField("Bank Name", "BankName")}
          {renderEditableField("Branch", "BankBranchName")}
          {renderEditableField("Account Number", "AccountNumber")}
          {renderEditableField("IFSC", "IFSCCode")}
          {renderEditableField("Account Type", "AccountType")}
        </div>

        <div className="hr-action-buttons">
          <button className="hr-btn hr-btn-primary">View Attendance</button>
          <button className="hr-btn hr-btn-secondary">Performance Review</button>
          <button className="hr-btn hr-btn-graph">Performance Graph</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

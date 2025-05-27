import React, { useState, useEffect } from 'react';
import './single_emp.css';
import { useParams, useNavigate } from 'react-router-dom';
const employee = {
  ImageURL: "https://i.pravatar.cc/150?img=3",
  FullName: "Amit Sharma",
  Email: "amit.sharma@example.com",
  PhoneNumber: "+91 9876543210",
  Department: "Engineering",
  Designation: "Senior Developer",
  JoiningDate: "2022-05-15",
  Address: "123, MG Road, Mumbai, India",
  DateOfBirth: "1990-07-20",
  EmergencyContact: "+91 9123456789",
  Education: "B.Tech in Computer Science",
  Certificates: "AWS Certified Developer, ReactJS Advanced",
  Branch: "Mumbai HQ",
  NetSalaryHourly: "350",
  NetSalaryDaily: "2800",
  NetSalaryMonthly: "84000",
  BasicSalary: "60000",
  Allowances: "24000",
  AccountNumber: "123456789012",
  IFSCCode: "SBIN0001234",
  BankName: "State Bank of India",
  BankBranchName: "Mumbai Main",
  Gender: "Male",
  AccountType: "Savings",
};

const EmployeeDetails = () => {
 const navigate = useNavigate();
      const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Replace this with your actual fetch logic (API or context)
    const fetchEmployee = async () => {
      const response = await fetch(`/api/employees/${id}`); // or use context/state
      const data = await response.json();
      setEmployee(data);
    };

    fetchEmployee();
  }, [id]);

if (!employee) 
  return (
    <>
      <p className="hr-loading-text">Loading employee...</p>
      <div className="hr-back-button-container">
          <div className="hr-btn-back" onClick={() => navigate(-1)}>
            ← 
          </div>
        </div>
    </>
  );



  return (
    <div className="hr-page-container">
      <div className="hr-card hr-employee-details">
          <div className="hr-back-button-container">
          <div className="hr-btn-back" onClick={() => navigate(-1)}>
            ← 
          </div>
        </div>
        {/* Profile Header */}
        <div className="hr-header">
          <img src={employee.ImageURL || '/default-profile.png'} alt="Employee" className="hr-profile-img" />
          <div className="hr-info">
            <h2 className="hr-heading">{employee.FullName}</h2>
            <p className="hr-subheading">{employee.Designation} | {employee.Department}</p>
            <p className="hr-branch">Branch: {employee.Branch}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="hr-details-grid">
          <div><strong className='emp-label'>Email:</strong> {employee.Email}</div>
          <div><strong className='emp-label'>Phone:</strong> {employee.PhoneNumber}</div>
          <div><strong className='emp-label'>Joining Date:</strong> {employee.JoiningDate}</div>
          <div><strong className='emp-label'>Gender:</strong> {employee.Gender}</div>
          <div><strong className='emp-label'>Date of Birth:</strong> {employee.DateOfBirth}</div>
          <div><strong className='emp-label'>Address:</strong> {employee.Address}</div>
          <div><strong className='emp-label'>Emergency Contact:</strong> {employee.EmergencyContact}</div>
          <div><strong className='emp-label'>Education:</strong> {employee.Education}</div>
          <div><strong className='emp-label'>Certificates:</strong> {employee.Certificates}</div>
        </div>

        {/* Salary Details */}
        <h3 className="hr-subsection-heading">Salary Info</h3>
        <div className="hr-details-grid">
          <div><strong className='emp-label'>Basic Salary:</strong> ₹{employee.BasicSalary}</div>
          <div><strong className='emp-label'>Allowances:</strong> ₹{employee.Allowances}</div>
          <div><strong className='emp-label'>Hourly:</strong> ₹{employee.NetSalaryHourly}</div>
          <div><strong className='emp-label'>Daily:</strong> ₹{employee.NetSalaryDaily}</div>
          <div><strong className='emp-label'>Monthly:</strong> ₹{employee.NetSalaryMonthly}</div>
        </div>

        {/* Bank Details */}
        <h3 className="hr-subsection-heading">Bank Info</h3>
        <div className="hr-details-grid">
          <div><strong className='emp-label'>Bank Name:</strong> {employee.BankName}</div>
          <div><strong className='emp-label'>Branch:</strong> {employee.BankBranchName}</div>
          <div><strong className='emp-label'>Account Number:</strong> {employee.AccountNumber}</div>
          <div><strong className='emp-label'>IFSC:</strong> {employee.IFSCCode}</div>
          <div><strong className='emp-label'>Account Type:</strong> {employee.AccountType}</div>
        </div>

        {/* Actions */}
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

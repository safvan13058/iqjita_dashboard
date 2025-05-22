import React, { useState } from 'react';
import './payroll.css';

const payrollData = [
  {
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'Finance',
    designation: 'Manager',
    payDate: '2025-05-14',
    basicSalary: '$5000',
    allowances: '$1000',
    deductions: '$500',
    netPay: '$5500',
  },
  {
    employeeId: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'Executive',
    payDate: '2025-05-14',
    basicSalary: '$4000',
    allowances: '$800',
    deductions: '$400',
    netPay: '$4400',
  },
];

const PayrollTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
const [employeeIdSearch, setEmployeeIdSearch] = useState("");
const [selectedMonth, setSelectedMonth] = useState("");
const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
const employeeList = [
  { id: "EMP001", name: "Alice" },
  { id: "EMP002", name: "Bob" },
  { id: "EMP003", name: "Charlie" },
  // ... populate dynamically or via API
];

const handleMonthFilter = (type) => {
  const today = new Date();
  if (type === 'thisMonth') {
    setSelectedMonth(today.toISOString().slice(0, 7)); // YYYY-MM
  } else if (type === 'previousMonth') {
    const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setSelectedMonth(prev.toISOString().slice(0, 7));
  }
};

  const filteredData = payrollData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (payroll) => {
    setSelectedPayroll(payroll);
  };

  const closeModal = () => {
    setSelectedPayroll(null);
  };

  return (
    <>
      <h2 className='hr-title'>Payroll Information</h2>

      <div className="payroll-filter-container">
  {/* Left Side - Search by Name, Department, Designation */}
  <div className="payroll-filter-left">
    <input
      type="text"
      className="payroll-search-input"
      placeholder="Search by Name, Department or Designation"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Right Side - Month Filters & Employee ID Search */}
  <div className="payroll-filter-right">
    <button className="payroll-filter-btn" onClick={() => handleMonthFilter('thisMonth')}>This Month</button>
    <button className="payroll-filter-btn" onClick={() => handleMonthFilter('previousMonth')}>Previous Month</button>

    <input
      type="month"
      className="payroll-month-picker"
      value={selectedMonth}
      onChange={e => setSelectedMonth(e.target.value)}
    />

   <select
  className="payroll-employee-id-input"
  value={selectedEmployeeId}
  onChange={(e) => setSelectedEmployeeId(e.target.value)}
>
  <option value="">Select Employee ID</option>
  {employeeList.map((employee) => (
    <option key={employee.id} value={employee.id}>
      {employee.id} - {employee.name}
    </option>
  ))}
</select>

  </div>
</div>

      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>NO OF LEAVES</th>
              <th>EARLY OUT</th>
              <th>LATE COMING</th>
              <th>REDUCEING AMOUNT</th>
              <th>LEAVE COMPENSATION</th>
              <th>SALARY</th>
              <th>TOTAL SALARY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'payroll-row' : 'payroll-row-alt'}>
                  <td>{item.employeeId}</td>
                  <td>{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.designation}</td>
                  <td>{item.payDate}</td>
                  <td>{item.payDate}</td>
                  <td>{item.payDate}</td>
                  <td>{item.payDate}</td>
                  <td>{item.payDate}</td>
                  <td>{item.payDate}</td>
               
                  <td>{item.netPay}</td>
                  <td>
                    <button 
                      className="payroll-action-btn"
                      onClick={() => openModal(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '15px' }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPayroll && (
        <div className="payroll-modal-overlay" onClick={closeModal}>
          <div className="payroll-modal" onClick={e => e.stopPropagation()}>
            <h3>Payroll Details</h3>
            <p><strong>Employee ID:</strong> {selectedPayroll.employeeId}</p>
            <p><strong>Name:</strong> {selectedPayroll.name}</p>
            <p><strong>Department:</strong> {selectedPayroll.department}</p>
            <p><strong>Designation:</strong> {selectedPayroll.designation}</p>
            <p><strong>Pay Date:</strong> {selectedPayroll.payDate}</p>
            <p><strong>Basic Salary:</strong> {selectedPayroll.basicSalary}</p>
            <p><strong>Allowances:</strong> {selectedPayroll.allowances}</p>
            <p><strong>Deductions:</strong> {selectedPayroll.deductions}</p>
            <p><strong>Net Pay:</strong> {selectedPayroll.netPay}</p>
            <button className="payroll-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollTable;


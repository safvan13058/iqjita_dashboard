import React, { useState, useEffect } from 'react';
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
  const [showModal, setShowModal] = useState(false);
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
  const handleSavePayroll = (updatedPayroll) => {
    // Here, update your backend or state
    console.log("Saving payroll:", updatedPayroll);
    closeModal(); // Close after save
  };
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [employeeData, setEmployeeData] = useState({
    name: "",
    department: "",
    designation: "",
    baseSalary: ""
  });

  useEffect(() => {
    fetch("https://software.iqjita.com/hr/employee.php?action=read")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);
const handleEmployeeChange = (e) => {
  const empId = e.target.value;
  setSelectedEmpId(empId);

  console.log("Selected Employee ID:", empId);

  if (!empId) return;

  fetch(`https://software.iqjita.com/hr/employee.php?action=read_single&EmployeeID=${empId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data);

      if (data.status === "success" && data.data) {
        const emp = data.data;
        console.log("Employee Details:", emp);

        setEmployeeData({
          name: emp.FullName || "",
          department: emp.Department || "",
          designation: emp.Designation || "",
          baseSalary: emp.SalaryDetails?.NetSalaryMonthly || ""
        });

        console.log("Updated Form State:", {
          name: emp.FullName || "",
          department: emp.Department || "",
          designation: emp.Designation || "",
          baseSalary: emp.SalaryDetails?.NetSalaryMonthly || ""
        });
      } else {
        console.warn("Failed to fetch employee data");
      }
    })
    .catch((error) => {
      console.error("Error fetching employee data:", error);
    });
};

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.numLeaves = parseInt(data.numLeaves);
    data.earlyOut = parseInt(data.earlyOut);
    data.lateComing = parseInt(data.lateComing);
    data.reducingAmount = parseFloat(data.reducingAmount);
    data.leaveCompensation = parseFloat(data.leaveCompensation);
    data.baseSalary = parseFloat(data.baseSalary);
    data.totalSalary = parseFloat(data.totalSalary);

    fetch("https://software.iqjita.com/hr/payroll.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result.message || "Payroll added");
        setShowModal(false);
        form.reset();
      })
      .catch((err) => {
        alert("Error adding payroll");
        console.error(err);
      });
  }

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
          <button className="payroll-hr-button" onClick={() => setShowModal(true)}> Pay Salary  </button>
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
          <div className="payroll-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="payroll-heading">Edit Payroll Details</h3>

            <div className="payroll-form-group">
              <label>Employee ID</label>
              <input
                type="text"
                value={selectedPayroll.employeeId}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, employeeId: e.target.value })}
                disabled
              />
            </div>

            <div className="payroll-form-group">
              <label>Name</label>
              <input
                type="text"
                value={selectedPayroll.name}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, name: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Department</label>
              <input
                type="text"
                value={selectedPayroll.department}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, department: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Designation</label>
              <input
                type="text"
                value={selectedPayroll.designation}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, designation: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Pay Date</label>
              <input
                type="date"
                value={selectedPayroll.payDate}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, payDate: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Basic Salary</label>
              <input
                type="number"
                value={selectedPayroll.basicSalary}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, basicSalary: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Allowances</label>
              <input
                type="number"
                value={selectedPayroll.allowances}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, allowances: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Deductions</label>
              <input
                type="number"
                value={selectedPayroll.deductions}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, deductions: e.target.value })}
              />
            </div>

            <div className="payroll-form-group">
              <label>Net Pay</label>
              <input
                type="number"
                value={selectedPayroll.netPay}
                onChange={(e) => setSelectedPayroll({ ...selectedPayroll, netPay: e.target.value })}
              />
            </div>

            <div className="payroll-modal-buttons">
              <button className="payroll-save-btn" onClick={() => handleSavePayroll(selectedPayroll)}>Save</button>
              <button className="payroll-close-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="payroll-hr-overlay">
          <div className="payroll-hr-modal">
            <button
              className="payroll-hr-close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3>Create Payroll</h3>
            <form onSubmit={handleSubmit} className="payroll-hr-form">
              <div className="payroll-hr-form-grid">
                <div className="payroll-hr-form-col">
                  <label>
                    Employee ID
                    <select value={selectedEmpId} onChange={handleEmployeeChange} required>
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.EmployeeID} value={emp.EmployeeID}>
                          {emp.EmployeeID} - {emp.FullName}
                        </option>
                      ))}
                    </select>
                  </label>



                  <label>
                    Name
                    <input
                      name="name"
                      placeholder="Name"
                      value={employeeData.name}
                      readOnly
                      required
                    />
                  </label>

                  <label>
                    Department
                    <input
                      name="department"
                      placeholder="Department"
                      value={employeeData.department}
                      readOnly
                      required
                    />
                  </label>

                  <label>
                    Designation
                    <input
                      name="designation"
                      placeholder="Designation"
                      value={employeeData.designation}
                      readOnly
                      required
                    />
                  </label>

                  <label>
                    Number of Leaves
                    <input name="numLeaves" type="number" placeholder="Leaves" required />
                  </label>

                  <label>
                    Early Out
                    <input name="earlyOut" type="number" placeholder="Early Out" required />
                  </label>
                </div>


                <div className="payroll-hr-form-col">
                  <label>
                    Late Coming
                    <input name="lateComing" type="number" placeholder="Late Coming" required />
                  </label>

                  <label>
                    Reducing Amount
                    <input name="reducingAmount" type="number" placeholder="Reducing Amount" required />
                  </label>

                  <label>
                    Leave Compensation
                    <input name="leaveCompensation" type="number" placeholder="Leave Compensation" required />
                  </label>

                  <label>
                    Base Salary
                    <input
                      name="baseSalary"
                      type="number"
                      placeholder="Base Salary"
                      value={employeeData.baseSalary}
                      readOnly
                      required
                    />
                  </label>


                  <label>
                    Total Salary
                    <input name="totalSalary" type="number" placeholder="Total Salary" required />
                  </label>

                  <label>
                    Pay Date
                    <input name="payDate" type="date" required />
                  </label>

                  {/* <label>
                    Updated By
                    <input name="updatedBy" placeholder="Updated By" required />
                  </label> */}
                </div>

              </div>

              <button type="submit" className="payroll-hr-submit-btn">Submit</button>
            </form>

          </div >
        </div >
      )}

    </>
  );
};

export default PayrollTable;


import React, { useState, useEffect } from "react";
import "./salarypage.css";

const SalaryPage = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const employeeID = JSON.parse(localStorage.getItem('user'))?.username;

  useEffect(() => {
    if (employeeID) {
      fetch(`https://software.iqjita.com/employee_full_data.php?action=full_profile&employee_id=${employeeID}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log("salary==", data)
            setEmployeeData(data);
            if (Array.isArray(data.payroll_history
            )) {
              setSalaryData(data.payroll_history
              );
            }
          } else {
            console.error("Failed to load employee data");
          }
        })
        .catch(err => console.error("Error:", err));
    }
  }, [employeeID]);

  const filteredSalaries = searchMonth
    ? salaryData.filter(s => s.SalaryMonth === searchMonth)
    : salaryData;

  return (
    <div className="salary-page-container">
      <h2 className="salary-page-title">Salary Payment History</h2>

      <div className="salary-search">
        <label htmlFor="month-input" className="salary-search-label">Select Month:</label>
        <input
          id="month-input"
          type="month"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          placeholder="Search by Month"
        />
      </div>

      <div className="salary-cards-container">
        {filteredSalaries.length > 0 ? (
          filteredSalaries.map((salary, idx) => (
            <div key={idx} className="salary-card">
              <div className="salary-card-info">
                <h3>{salary.SalaryMonth}</h3>
                <p><strong>Base Salary:</strong> ₹{salary.BaseSalary}</p>
                <p><strong>Total:</strong> ₹{salary.TotalSalary}</p>
                <p><strong>Receipt ID:</strong> {salary.ReceiptID}</p>
                <p><strong>Paid On:</strong> {salary.PayDate}</p>
              </div>
              <div className="salary-card-actions">
                <button
                  className="btn-primary"
                  onClick={() => alert(`Viewing details for ${salary.SalaryMonth}`)}
                >
                  View
                </button>
                <a
                  className="btn-secondary"
                  // href={salary.payslipUrl || "#"}
                  // target="_blank"
                  rel="noopener noreferrer"
                >
                  Payslip
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-text">No salary found for {searchMonth || "selected month"}.</p>
        )}
      </div>
    </div>
  );
};

export default SalaryPage;

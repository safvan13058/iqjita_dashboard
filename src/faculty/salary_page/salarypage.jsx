import React, { useState } from "react";
import "./salarypage.css";

const mockSalaries = [
  {
    id: 1,
    month: "2024-05",
    amount: "₹45,000",
    status: "Paid",
    datePaid: "2024-06-01",
    payslipUrl: "/payslips/may-2024.pdf"
  },
  {
    id: 2,
    month: "2024-04",
    amount: "₹45,000",
    status: "Paid",
    datePaid: "2024-05-01",
    payslipUrl: "/payslips/apr-2024.pdf"
  },

  {
    id: 2,
    month: "2024-03",
    amount: "₹45,000",
    status: "Paid",
    datePaid: "2024-05-01",
    payslipUrl: "/payslips/apr-2024.pdf"
  },
  {
    id: 2,
    month: "2024-02",
    amount: "₹45,000",
    status: "Paid",
    datePaid: "2024-05-01",
    payslipUrl: "/payslips/apr-2024.pdf"
  },
  // Add more mock data
];

const SalaryPage = () => {
  const [searchMonth, setSearchMonth] = useState("");

  const filteredSalaries = searchMonth
    ? mockSalaries.filter(s => s.month === searchMonth)
    : mockSalaries;

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
          filteredSalaries.map((salary) => (
            <div key={salary.id} className="salary-card">
              <div className="salary-card-info">
                <h3>{salary.month}</h3>
                <p><strong>Amount:</strong> {salary.amount}</p>
                <p><strong>Status:</strong> {salary.status}</p>
                <p><strong>Paid On:</strong> {salary.datePaid}</p>
              </div>
              <div className="salary-card-actions">
                <button className="btn-primary" onClick={() => alert(`Viewing details for ${salary.month}`)}>
                  View
                </button>
                <a className="btn-secondary" href={salary.payslipUrl} target="_blank" rel="noopener noreferrer">
                  Payslip
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-text">No salary found for {searchMonth}</p>
        )}
      </div>
    </div>
  );
};

export default SalaryPage;

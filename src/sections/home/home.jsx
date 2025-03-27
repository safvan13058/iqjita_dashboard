import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import AdmissionForm from "../admission/admission";
import FeeForm from "../fees/fees";
import CourseForm from "../course/course";

const Home = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const transactions = [
    { id: 1, student: "John Doe", amount: 5000, date: "2023-05-15", status: "Completed", method: "Bank Transfer" },
    { id: 2, student: "Jane Smith", amount: 7500, date: "2023-05-14", status: "Pending", method: "MPESA" },
    { id: 3, student: "Mike Johnson", amount: 10000, date: "2023-05-13", status: "Completed", method: "Cash" },
    { id: 4, student: "Sarah Williams", amount: 6000, date: "2023-05-12", status: "Failed", method: "Cheque" },
    { id: 5, student: "David Brown", amount: 8500, date: "2023-05-11", status: "Completed", method: "Bank Transfer" },
  ];

  return (
    <div className="dashboard-containers">
      {activeForm === "admission" && <AdmissionForm onBack={() => setActiveForm(null)} />}
      {activeForm === "fee" && <FeeForm onBack={() => setActiveForm(null)} />}
      {activeForm === "course" && <CourseForm onBack={() => setActiveForm(null)} />}

      {!activeForm && (
        <>
          <div className="stat-cards">
            <div className="stat-card" onClick={() => navigate("/admission")}>
              <h2>ADMISSION</h2>
              <p>Manage student admissions</p>
            </div>

            <div className="stat-card" onClick={() => navigate("/fee-payment")}>
              <h2>Fee Payment</h2>
              <p>Process fee payments</p>
            </div>

            <div className="stat-card" onClick={() => navigate("/course")}>
              <h2>Course</h2>
              <p>Manage courses</p>
            </div>
          </div>

          <div className="transaction-table-container">
            <h2>Recent Transactions</h2>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.student}</td>
                    <td>{transaction.amount.toLocaleString()}</td>
                    <td>{transaction.date}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="view-all-btn" onClick={() => setShowPopup(true)}>
              View All Transactions 
            </button>
          </div>
        </>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>All Transactions</h2>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.student}</td>
                    <td>{transaction.amount.toLocaleString()}</td>
                    <td>{transaction.date}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import AdmissionForm from "../admission/admission";
import FeeForm from "../fees/fees";
import CourseForm from "../course/course";
import { Maximize, Minimize } from "lucide-react"; 
const Home = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all', 'credit', 'debit'
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // const transactions = [
  //   { id: 1, student: "John Doe", amount: 5000, date: "2023-05-15", status: "Completed", method: "Bank Transfer" },
  //   { id: 2, student: "Jane Smith", amount: 7500, date: "2023-05-14", status: "Pending", method: "MPESA" },
  //   { id: 3, student: "Mike Johnson", amount: 10000, date: "2023-05-13", status: "Completed", method: "Cash" },
  //   { id: 4, student: "Sarah Williams", amount: 6000, date: "2023-05-12", status: "Failed", method: "Cheque" },
  //   { id: 5, student: "David Brown", amount: 8500, date: "2023-05-11", status: "Completed", method: "Bank Transfer" },
  // ];
  useEffect(() => {
    fetchTransactions();
  }, [filter, date, month, startDate, endDate]);

  const fetchTransactions = async () => {
    let url = "https://software.iqjita.com/administration.php?action=gettransactiondetails";

    if (filter !== "all") url += `&type=${filter}`;
    if (date) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&date=${date}`;
    if (month) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&month=${month}`;
    if (startDate && endDate) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      console.log("🔍 Raw API Response Transactions:", text); // Debugging log

      // ✅ Split response if multiple JSON objects exist
      const jsonObjects = text.trim().split("\n");
      const lastJson = jsonObjects.pop(); // Take the second (last) JSON object

      let data;
      try {
        data = JSON.parse(lastJson); // ✅ Parse the correct JSON
      } catch (error) {
        throw new Error("❌ Invalid JSON response from server:\n");
      }

      if (data.status === "success") {
        setTransactions(data.transactions);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // return (
  //   <div className="dashboard-containers">
  //     {activeForm === "admission" && <AdmissionForm onBack={() => setActiveForm(null)} />}
  //     {activeForm === "fee" && <FeeForm onBack={() => setActiveForm(null)} />}
  //     {activeForm === "course" && <CourseForm onBack={() => setActiveForm(null)} />}

  //     {!activeForm && (
  //       <>
  //         <div className="stat-cards">
  //           <div className="stat-card" onClick={() => navigate("/admission")}>
  //             <h2>ADMISSION</h2>
  //             <p>Manage student admissions</p>
  //           </div>

  //           <div className="stat-card" onClick={() => navigate("/fee-payment")}>
  //             <h2>Fee Payment</h2>
  //             <p>Process fee payments</p>
  //           </div>

  //           <div className="stat-card" onClick={() => navigate("/course")}>
  //             <h2>Course</h2>
  //             <p>Manage courses</p>
  //           </div>
  //         </div>

  //         <div className="transaction-table-container">
  //           <h2>Recent Transactions</h2>
  //           <table className="transaction-table">
  //             <thead>
  //               <tr>
  //                 <th>ID</th>
  //                 <th>Student</th>
  //                 <th>Amount</th>
  //                 <th>Date</th>
  //                 <th>Status</th>
  //                 <th>Method</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {transactions.map((transaction) => (
  //                 <tr key={transaction.id}>
  //                   <td>{transaction.id}</td>
  //                   <td>{transaction.student}</td>
  //                   <td>{transaction.amount.toLocaleString()}</td>
  //                   <td>{transaction.date}</td>
  //                   <td>
  //                     <span className={`status-badge ${transaction.status.toLowerCase()}`}>
  //                       {transaction.status}
  //                     </span>
  //                   </td>
  //                   <td>{transaction.method}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //           <button className="view-all-btn" onClick={() => setShowPopup(true)}>
  //             View All Transactions 
  //           </button>
  //         </div>
  //       </>
  //     )}

  //     {showPopup && (
  //       <div className="popup-overlay">
  //         <div className="popup-content">
  //           <h2>All Transactions</h2>
  //           <table className="transaction-table">
  //             <thead>
  //               <tr>
  //                 <th>ID</th>
  //                 <th>Student</th>
  //                 <th>Amount</th>
  //                 <th>Date</th>
  //                 <th>Status</th>
  //                 <th>Method</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {transactions.map((transaction) => (
  //                 <tr key={transaction.id}>
  //                   <td>{transaction.id}</td>
  //                   <td>{transaction.student}</td>
  //                   <td>{transaction.amount.toLocaleString()}</td>
  //                   <td>{transaction.date}</td>
  //                   <td>
  //                     <span className={`status-badge ${transaction.status.toLowerCase()}`}>
  //                       {transaction.status}
  //                     </span>
  //                   </td>
  //                   <td>{transaction.method}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //           <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
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

            {/* Filter Dropdown */}
            {/* <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select> */}

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
                {(transactions || []).length > 0 ? (
                  transactions.slice(0, 5).map((transaction) => ( // Slice the first 5 transactions
                    <tr key={transaction.transaction_id}>
                      <td>{transaction.transaction_id}</td>
                      <td>{transaction.remark}</td>
                      <td>{parseFloat(transaction.amount).toLocaleString()}</td>
                      <td>{transaction.created_at}</td>
                      <td>
                        <span className={`status-badge ${transaction.type.toLowerCase()}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.updated_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No transactions found</td>
                  </tr>
                )}

              </tbody>
            </table>

            <button className="view-all-btn" onClick={() => setShowPopup(true)}>
              View All Transactions
            </button>
          </div>
        </>
      )}

      {/* {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>All Transactions</h2>
            <button className="close-modal" onClick={() => setShowPopup(false)}>×</button>
            <div className="filters-container">
              <div className="filter-group">
                <label>Transaction Type</label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                  <option value="all">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Filter by Date</label>
                <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
              </div>

              <div className="filter-group">
                <label>Filter by Month</label>
                <input type="month" onChange={(e) => setMonth(e.target.value)} value={month} />
              </div>

              <div className="filter-group">
                <label>Start Date</label>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
              </div>

              <div className="filter-group">
                <label>End Date</label>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
              </div>
            </div>
            <div className="popup-table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Bill Number</th>
                    <th>Current Balance</th>
                    <th>Remark</th>
                    <th>Updated By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                      <td>{transaction.transaction_id}</td>
                      <td>{parseFloat(transaction.amount).toLocaleString()}</td>
                      <td> <span className={`status-badge ${transaction.type.toLowerCase()}`}>
                          {transaction.type}
                        </span></td>
                      <td>{transaction.bill_number}</td>
                      <td>{parseFloat(transaction.current_balance).toLocaleString()}</td>
                      <td>{transaction.remark}</td>
                      <td>{transaction.updated_by}</td>
                      <td>{transaction.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )} */}
      {showPopup && (
        <div className={`popup-overlay ${isFullScreen ? "fullscreen" : ""}`}>
          <div className="popup-content">
            <div className="Transactions-head">
              <h2>All Transactions</h2>

              {/* Buttons: Close & Full Screen Toggle */}
              <div className="popup-buttons">
                <button className="fullscreen-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
                <button className="close-modal" onClick={() => setShowPopup(false)}>×</button>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-container">
              <div className="filter-group">
                <label>Transaction Type</label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                  <option value="all">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Filter by Date</label>
                <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
              </div>

              <div className="filter-group">
                <label>Filter by Month</label>
                <input type="month" onChange={(e) => setMonth(e.target.value)} value={month} />
              </div>

              <div className="filter-group">
                <label>Start Date</label>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
              </div>

              <div className="filter-group">
                <label>End Date</label>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
              </div>
            </div>

            {/* Transaction Table */}
            <div className="popup-table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Bill Number</th>
                    <th>Current Balance</th>
                    <th>Remark</th>
                    <th>Updated By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                      <td>{transaction.transaction_id}</td>
                      <td>{parseFloat(transaction.amount).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${transaction.type.toLowerCase()}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.bill_number}</td>
                      <td>{parseFloat(transaction.current_balance).toLocaleString()}</td>
                      <td>{transaction.remark}</td>
                      <td>{transaction.updated_by}</td>
                      <td>{transaction.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button> */}
          </div>
        </div>
      )}

    </div>
  );
};


export default Home;

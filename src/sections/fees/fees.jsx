import React, { useState, useEffect } from "react";
import './fees.css';
import { format, isTuesday } from 'date-fns';
import { useLocation } from 'react-router-dom';
const FeeForm = ({ onBack, currentUser }) => {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(location.state?.student || null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selecteds, selected] = useState(false);
  const [error, setError] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("Computer Science");

  const courseOptions = [
    "Computer Science",
    "Business Administration",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Data Science",
  ]; // ✅ List of courses
  // Fetch students from API when selectedCourse changes
  useEffect(() => {
    fetchStudents();
  }, [selectedCourse]);


  useEffect(() => {
    if (location.state?.student) {
      setSearchQuery(`${location.state.student.name} (${location.state.student.admission_number})`);
      selected(true);
    } else {
      fetchStudents();
    }
  }, [location.state]);
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://software.iqjita.com/administration.php?action=liststudentbycourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ course: selectedCourse }), // ✅ Dynamic course filtering
        }
      );

      const text = await response.text(); // Read raw response
      console.log("🔍 Raw API Response:", text); // Debugging log

      // Extract only the last valid JSON object (if multiple exist)
      const jsonObjects = text.trim().split("\n"); // Split by newline
      const lastJson = jsonObjects.pop(); // Get last valid JSON object

      let result;
      try {
        result = JSON.parse(lastJson);
      } catch (error) {
        throw new Error("❌ Invalid JSON response from server:\n" + text);
      }

      if (response.ok) {
        console.log("✅ Parsed API Response:", result); // Debugging log

        if (result.status === "success") {
          const formattedStudents = result.students.map((student) => ({
            admission_number: student.admission_number.toString(),
            name: student.name,
            course: student.course,
            total_paid: parseFloat(student.final_fee) - parseFloat(student.exact_fee),
            total_pending: parseFloat(student.final_fee),
          }));
          setStudents(formattedStudents);
        } else {
          setError("Failed to fetch students: " + (result.error || "Unknown error"));
        }
      } else {
        setError("❌ Server Error: " + response.statusText);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(`${student.name} (${student.admission_number})`);
    setPaymentStatus(null);
    selected(true)
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !amount) {
      setError("Please select a student and enter an amount");
      return;
    }

    if (isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "https://software.iqjita.com/administration.php?action=course_fee",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admission_number: selectedStudent.admission_number,
            course: selectedStudent.course,
            paying_fee: parseFloat(amount),
            // payment_method: paymentMethod,
            // transaction_id: transactionId,
            updated_by: currentUser?.username || "admin"
          }),
        }
      );



      const text = await response.text();
      console.log("🔍 Raw API Response feee:", text);

      // ✅ Split response if multiple JSON objects exist
      const jsonObjects = text.trim().split("\n");
      const lastJson = jsonObjects.pop(); // Take the second (last) JSON object

      let result;
      try {
        result = JSON.parse(lastJson); // ✅ Parse the correct JSON
      } catch (error) {
        throw new Error("❌ Invalid JSON response from server:\n" + text);
      }

      // ✅ Check if API returned success or error
      if (result.status === "success") {
        console.log("✅ Payment Successful:", result);
        const receipt = {
          date: format(new Date(), 'yyyy-MM-dd HH:mm'),
          studentName: selectedStudent.name,
          admissionNumber: selectedStudent.admission_number,
          course: selectedStudent.course,
          amount: parseFloat(amount),
          paymentMethod,
          transactionId,
          processedBy: currentUser?.username || "admin",
          newBalance: result.TotalPending
        };

        setPaymentStatus({
          message: result.message,
          admissionNumber: result.admission_number,
          totalPaid: result.TotalPaid,
          totalPending: result.TotalPending,
          receipt
        });

        setReceiptData(receipt);
        // setAmount("");
        setTransactionId("");

      } else {
        throw new Error(result.error || "Payment failed. Please try again.");
      }

      // Generate receipt data

    } catch (err) {
      setError(err.message);
      console.error("Payment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const printReceipt = () => {
    // In a real app, you would implement proper receipt printing
    window.print();
  };
  const resetForm = () => {
    setSelectedStudent(null);
    setSearchQuery("");
    setAmount("");
    selected(false)
    setPaymentStatus(null);
    setError(null);
    fetchStudents();
  };

  return (
    <div className="fee-form-container">
      <h2 className="fee-form-title">Fee Payment System</h2>

      {!selectedStudent ? (
        <div className="student-list-section">
          <div className="list-controls">
            <h3 className="student-list-title">Student Records</h3>
            
            <div className="search-filter-container">
              <div className="search-container">
                <input
                  type="text"
                  className="fee-form-search-input"
                  placeholder="Search by name or admission number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                
                {searchQuery && (
                  <div className="dropdown-container">
                    <ul className="fee-form-dropdown">
                      {students
                        .filter(student => 
                          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.admission_number.includes(searchQuery)
                        )
                        .map(student => (
                          <li
                            key={student.admission_number}
                            className="fee-form-dropdown-item"
                            onClick={() => handleSelectStudent(student)}
                          >
                            <div className="student-info">
                              <strong>{student.name}</strong>
                              <span>{student.admission_number}</span>
                            </div>
                            <div className="student-course">
                              {student.course}
                            </div>
                            <div className="student-balance">
                              Paid: {student.total_paid?.toLocaleString()} |
                              Pending: {student.total_pending?.toLocaleString()}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="filter-container">
                <label>Filter by Course:</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="fee-form-input"
                >
                  {courseOptions.map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="student-list-header">
            <span>Admission No.</span>
            <span>Student Name</span>
            <span>Course</span>
            <span>Paid </span>
            <span>Pending </span>
            <span>Actions</span>
          </div>

          <div className="student-list">
            {students.map(student => (
              <div
                key={student.admission_number}
                className={`student-list-item ${selectedStudent?.admission_number === student.admission_number ? 'active' : ''}`}
              >
                <span>{student.admission_number}</span>
                <span>{student.name}</span>
                <span>{student.course}</span>
                <span>{student.total_paid?.toLocaleString()}</span>
                <span>{student.total_pending?.toLocaleString()}</span>
                <span>
                  <button
                    className="select-student-btn"
                    onClick={() => handleSelectStudent(student)}
                  >
                    Select
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form className="fee-form" onSubmit={handleSubmit}>
          <div className="student-header">
            <h3>{selectedStudent.name}</h3>
            <p>Admission: {selectedStudent.admission_number} | {selectedStudent.course}</p>
          </div>

          <div className="form-grid">
            <div className="fee-form-field">
              <label className="fee-form-label">Amount</label>
              <input
                type="number"
                className="fee-form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                autoFocus
              />
            </div>

            <div className="fee-form-field">
              <label className="fee-form-label">Payment Method</label>
              <select
                className="fee-form-input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="BANK">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="ONLINE">Online</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {paymentMethod !== "CASH" && (
              <div className="fee-form-field">
                <label className="fee-form-label">
                  {paymentMethod === "MPESA" ? "MPESA Code" : "Transaction ID"}
                </label>
                <input
                  type="text"
                  className="fee-form-input"
                  placeholder={`Enter ${paymentMethod === "MPESA" ? "MPESA" : "transaction"} code`}
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required={paymentMethod !== "CASH"}
                />
              </div>
            )}
          </div>

          {error && <div className="fee-form-error">{error}</div>}

          <div className="fee-form-buttons">
            <button
              type="submit"
              className="fee-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                "Process Payment"
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="fee-form-back"
            >
              Select Different Student
            </button>
          </div>
        </form>
      )}

      {paymentStatus && (
        <div className="payment-success-container">
          <div className="payment-success">
            <div className="success-header">
              <svg className="success-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              <h3>Payment Successful</h3>
            </div>

            <div className="payment-details">
              <p><strong>Student:</strong> {selectedStudent.name}</p>
              <p><strong>Admission No:</strong> {paymentStatus.admissionNumber}</p>
              <p><strong>Amount Paid:</strong>  {parseFloat(amount)}</p>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
              {transactionId && <p><strong>Transaction ID:</strong> {transactionId}</p>}
              <p><strong>Total Paid:</strong>  {paymentStatus.totalPaid?.toLocaleString()}</p>
              <p><strong>Balance:</strong>  {paymentStatus.totalPending?.toLocaleString()}</p>
              <p><strong>Processed By:</strong> {currentUser?.username || "admin"}</p>
              <p><strong>Date:</strong> {format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
            </div>

            <div className="receipt-actions">
              <button onClick={printReceipt} className="print-btn">
                Print Receipt
              </button>
              <button onClick={resetForm} className="new-payment-btn">
                New Payment
              </button>
              <button onClick={onBack} className="back-btn">
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Hidden receipt for printing */}
          <div className="printable-receipt" style={{ display: 'none' }}>
            <h2>Fee Payment Receipt</h2>
            <p>Date: {format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
            <p>Receipt No: {Math.floor(Math.random() * 1000000)}</p>
            <hr />
            <p><strong>Student Name:</strong> {selectedStudent.name}</p>
            <p><strong>Admission No:</strong> {paymentStatus.admissionNumber}</p>
            <p><strong>Course:</strong> {selectedStudent.course}</p>
            <hr />
            <p><strong>Amount Paid:</strong>  {parseFloat(amount).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
            {transactionId && <p><strong>Transaction ID:</strong> {transactionId}</p>}
            <hr />
            <p><strong>Total Paid:</strong> KES {paymentStatus.totalPaid?.toLocaleString()}</p>
            <p><strong>Balance:</strong> KES {paymentStatus.totalPending?.toLocaleString()}</p>
            <hr />
            <p>Processed By: {currentUser?.username || "admin"}</p>
            <p>Thank you for your payment!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeForm;
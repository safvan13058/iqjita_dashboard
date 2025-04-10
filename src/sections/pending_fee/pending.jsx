import React, { useState } from 'react';
import './pending.css'
const Pending = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [template, setTemplate] = useState("Hi {name}, your due amount is Rs {amount}. Please pay soon.");
  const [tempTemplate, setTempTemplate] = useState(template);
  const [period, setPeriod] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchPendingStudents = async () => {
    if (!period) {
      alert("Please enter a period in days.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://software.iqjita.com/pendingfee.php?days${period}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      } else {
        alert("Failed to fetch data");
      }
    } catch (error) {
      alert("Error fetching students");
    }
    setLoading(false);
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === students.length ? [] : students.map((s) => s.admission_number));
  };

  const toggleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const sendMessages = (type) => {
    selected.forEach((id) => {
      const student = students.find((s) => s.admission_number === id);
      if (!student) return;

      const message = template
        .replace("{name}", student.name)
        .replace("{amount}", student.amount)
        .replace("{number}", student.contact_number);

      fetch(`/api/send-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: student.contact_number,
          message,
        }),
      });
    });
    alert(`${type.toUpperCase()} sent!`);
  };

  return (
    <div className="pending-students-container">
      <h2>Pending Students Due</h2>
      <div className="topbanner" >
        <label>
          <input
            type="checkbox"
            checked={selected.length === students.length}
            onChange={toggleSelectAll}
          />
          Select All
        </label>

        <button onClick={() => setShowModal(true)}>Edit Message Template</button>

        <button onClick={() => sendMessages("sms")}>Send SMS</button>
        <button onClick={() => sendMessages("email")}>Send Email</button>
        <button onClick={() => sendMessages("whatsapp")}>Send WhatsApp</button>
        <div className="form-row">
          <input
            type="number"
            placeholder="Enter period (in days)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <button onClick={fetchPendingStudents}>Fetch</button>
        </div>
      </div>
      {showModal && (
        <div className="msg-modal-overlay">
          <div className="msg-modal">
            <h3>Edit Message Template</h3>
            <textarea
              value={tempTemplate}
              onChange={(e) => setTempTemplate(e.target.value)}
              rows={5}
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={() => {
                  setTemplate(tempTemplate);
                  setShowModal(false);
                }}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}



      {loading && <p>Loading...</p>}

      {students.length > 0 ? (
        <div className="student-list">
          <h3>Students with Due Installments</h3>

          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Due Date</th>
                  <th>Due Amount</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.admission_number}>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>{student.batch_time}</td>
                    <td>{student.due_date}</td>
                    <td>{student.due_amount}</td>
                    <td>{student.paid_amount}</td>
                    <td>{student.pending_amount}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleStartBatch(student)}
                      >
                        Start Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-students">
          <h3>No students with due installments found.</h3>
        </div>
      )}

    </div>
  );
};

export default Pending;

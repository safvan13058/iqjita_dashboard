import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import animation1 from '../images/gif/email.json';
import { FaEdit, FaSms, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

import './pending.css'
const Pending = () => {
  const [students, setStudents] = useState('');
  const [allstudent, Students] = useState('');

  const [selected, setSelected] = useState([]);
  const [template, setTemplate] = useState("Hi {name}, your due amount is Rs {due_amount}. Please pay soon.");
  const [tempTemplate, setTempTemplate] = useState(template);
  const [period, setPeriod] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingType, setSendingType] = useState(null);
  const [sendingStatus, setSendingStatus] = useState(null); // "sending" | "success" | null
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [filteredStudents, setFilteredStudents] = useState([]);
useEffect(() => {
  if (searchQuery.trim() === "") {
    setFilteredStudents(students); // Show all if query is empty
  } else {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredStudents(filtered);
  }
}, [searchQuery, students]);

  const user = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("fee_msg_templates")) || [];
    setSavedTemplates(saved);

    if (saved.length > 0) {
      setTemplate(saved[0].content);
      setTempTemplate(saved[0].content);
      setSelectedTemplate(saved[0].name);
    }
  }, []);
  const saveTemplate = () => {
    const name = prompt("Enter a name for this template:");
    if (!name) return;

    const newTemplate = { name, content: tempTemplate };

    const updatedTemplates = [...savedTemplates.filter(t => t.name !== name), newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("fee_msg_templates", JSON.stringify(updatedTemplates));
    setTemplate(tempTemplate);
    setSelectedTemplate(name);
    setShowModal(false);
  };
  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    if (!period) {
      alert("Please enter a period in days.");
      return;
    }
    setStudents([]);

    setLoading(true);
    try {
      const response = await fetch(`https://software.iqjita.com/pendingfee.php?days=${period}`);
      const data = await response.json();
      console.log("students", data)
      if (data.status === "success") {

        setStudents(data.data || []);
        Students(data.data)
      } else {
        setStudents([]);
        alert("Failed to fetch data");
      }
    } catch (error) {
      setStudents([]);
      alert("Error fetching students");
    }
    setLoading(false);
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === students.length ? [] : [...students]);

  };

  const toggleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const toggleSelectStudent = (id) => {
    setSelected((prev) => {
      const isSelected = prev.some((s) => s.admission_number === id);
      if (isSelected) {
        return prev.filter((s) => s.admission_number !== id);
      } else {
        const student = students.find((s) => s.admission_number === id);
        return student ? [...prev, student] : prev;
      }
    });

  };

  const sendMessages = (type) => {
    setSendingType(type);
    setSendingStatus("sending");
    console.log("students", selected)

    let url = "";
    if (type === "email") url = "https://software.iqjita.com/email_sender.php";
    // Add other URLs for SMS, WhatsApp if needed

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template,
        students: selected, // selected students if filtering
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`${type} response:`, data);
        setSendingStatus("success");
      })
      .catch((err) => {
        console.error("Sending failed", err);
        setSendingStatus("error");
      });
  };

  console.log("students", students);
  return (
    <div className="pending-students-container">
      <h2>Pending Students Due</h2>
      <div className="topbanner" >
        {/* <label>
          <input
            type="checkbox"
            checked={selected.length > 0 && selected.length === students.length}

            onChange={toggleSelectAll}
          />
          Select All
        </label> */}
        <div>
          <button onClick={() => setShowModal(true)}>
            <FaEdit style={{ marginRight: '8px' }} /> <span>Msg-Template</span>
          </button>

          <button onClick={() => sendMessages("sms")}>
            <FaSms style={{ marginRight: '8px' }} /> <span> SMS</span>
          </button>

          <button onClick={() => sendMessages("email")}>
            <FaEnvelope style={{ marginRight: '8px' }} /> <span> Email </span>
          </button>

          <button onClick={() => sendMessages("whatsapp")}>
            <FaWhatsapp style={{ marginRight: '8px' }} />  <span>WhatsApp </span>
          </button>
        </div>
        <div className="form-row1">
          <input
            type="number"
            placeholder="Enter period (in days)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <button onClick={fetchPendingStudents}>Fetch</button>
        </div>
      </div>


      {/* {showModal && (
        <div className="msg-modal-overlay">
          <div className="msg-modal">
            <div className="msg-head">
              <h3>Edit Message Template</h3>
              <div className="info-icon" onClick={() => setShowHelp(true)}>!</div>
            </div>

            {showHelp && (
              <div className="template-help-popup">
                <div className="popup-content">
                  <h4>How to Write Template</h4>
                  <p>You can use the following placeholders in your message:</p>
                  <ul>
                    <li><code>{`{name}`}</code> – Student's full name</li>
                    <li><code>{`{email}`}</code> – Email address</li>
                    <li><code>{`{due_date}`}</code> – Due date of the installment</li>
                    <li><code>{`{pending_amount}`}</code> – Amount pending</li>
                    <li><code>{`{admission_number}`}</code> – Admission number</li>
                    <li><code>{`{batch_time}`}</code> – Batch timing</li>
                    <li><code>{`{course}`}</code> – Course name</li>
                    <li><code>{`{contact_number}`}</code> – Contact number</li>
                    <li><code>{`{due_amount}`}</code> – Due amount</li>
                    <li><code>{`{paid_amount}`}</code> – Paid amount</li>
                    <li><code>{`{installment_number}`}</code> – Installment number</li>
                  </ul>

                  <h5>Example Templates:</h5>
                  <p><code>Dear {`{name}`}, you have a pending fee of {`{pending_amount}`} due on {`{due_date}`}.</code></p>
                  <p><code>Hello {`{name}`}, your {`{course}`} class at {`{batch_time}`} has a due amount of {`{pending_amount}`}.</code></p>

                  <div className="popup-actions">
                    <button onClick={() => setShowHelp(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}

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
      )} */}
      {showModal && (
        <div className="msg-modal-overlay">
          <div className="msg-modal">
            <div className="msg-head">
              <h3>Edit Message Template</h3>
              <div className="info-icon" onClick={() => setShowHelp(true)}>!</div>
            </div>

            {showHelp && (
              <div className="template-help-popup">
                <div className="popup-content">
                  <h4>How to Write Template</h4>
                  <p>You can use the following placeholders in your message:</p>
                  <ul>
                    <li><code>{`{name}`}</code> – Student's full name</li>
                    <li><code>{`{email}`}</code> – Email address</li>
                    <li><code>{`{due_date}`}</code> – Due date of the installment</li>
                    <li><code>{`{pending_amount}`}</code> – Amount pending</li>
                    <li><code>{`{admission_number}`}</code> – Admission number</li>
                    <li><code>{`{batch_time}`}</code> – Batch timing</li>
                    <li><code>{`{course}`}</code> – Course name</li>
                    <li><code>{`{contact_number}`}</code> – Contact number</li>
                    <li><code>{`{due_amount}`}</code> – Due amount</li>
                    <li><code>{`{paid_amount}`}</code> – Paid amount</li>
                    <li><code>{`{installment_number}`}</code> – Installment number</li>
                  </ul>

                  <h5>Example Templates:</h5>
                  <p><code>Dear {`{name}`}, you have a pending fee of {`{pending_amount}`} due on {`{due_date}`}.</code></p>
                  <p><code>Hello {`{name}`}, your {`{course}`} class at {`{batch_time}`} has a due amount of {`{pending_amount}`}.</code></p>

                  <div className="popup-actions">
                    <button onClick={() => setShowHelp(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: "10px" }}>
              <select
                value={selectedTemplate || ""}
                onChange={(e) => {
                  const name = e.target.value;
                  const found = savedTemplates.find((t) => t.name === name);
                  if (found) {
                    setSelectedTemplate(name);
                    setTemplate(found.content);
                    setTempTemplate(found.content);
                  }
                }}
              >
                <option value="">Select Saved Template</option>
                {savedTemplates.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

            </div>

            <textarea
              value={tempTemplate}
              onChange={(e) => setTempTemplate(e.target.value)}
              rows={5}
              style={{ width: "100%" }}
            />

            <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>

              {selectedTemplate && (
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    const updated = savedTemplates.filter((t) => t.name !== selectedTemplate);
                    setSavedTemplates(updated);
                    localStorage.setItem("fee_msg_templates", JSON.stringify(updated));
                    setSelectedTemplate(null);
                    setTemplate("");
                    setTempTemplate("");
                  }}
                >
                  Delete
                </button>
              )}
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={() => {
                  const name = prompt("Enter name for this template:");
                  if (!name) return;

                  const newTemplate = { name, content: tempTemplate };
                  const updated = [...savedTemplates.filter((t) => t.name !== name), newTemplate];

                  setSavedTemplates(updated);
                  localStorage.setItem("fee_msg_templates", JSON.stringify(updated));
                  setTemplate(tempTemplate);
                  setSelectedTemplate(name);
                  setShowModal(false);
                }}
              >
                Save as New
              </button>
            </div>
          </div>
        </div>
      )}




      {loading && <p>Loading...</p>}


      <div className="student-list">
        <h3>Students with Due Installments</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === students.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Due Date</th>
                <th>Due Amount</th>
                <th>Installment</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (

                (console.log("students", filteredStudents), filteredStudents.map((student) => (
                  <tr key={student.admission_number} className={selected.some((s) => s.admission_number === student.admission_number) ? "selected" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox1"
                        checked={selected.some((s) => s.admission_number === student.admission_number)}
                        onChange={() => toggleSelectStudent(student.admission_number)}
                      />
                    </td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>{student.batch_time}</td>
                    <td>{student.due_date}</td>
                    <td>{student.due_amount}</td>
                    <td>{student.installment_number}</td>
                    <td>{student.paid_amount}</td>
                    <td>{student.pending_amount}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => {
                          setCurrentStudent(student);
                          setIsPopupOpen(true);
                        }}
                      >
                        View
                      </button>

                    </td>

                  </tr>
                )))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                    No students with due installments found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
      {isPopupOpen && currentStudent && (
        <div className="due-modal-overlay">
          <div className="due-modal-content">
            <h2>Student Details</h2>
            <p><strong>Name:</strong> {currentStudent.name}</p>
            <p><strong>Course:</strong> {currentStudent.course}</p>
            <p><strong>Due Date:</strong> {currentStudent.due_date}</p>
            <p><strong>Installment:</strong> {currentStudent.installment_number}</p>

            <label>New Due Date:</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]} // sets today's date as the minimum
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />


            <button onClick={async () => {
              const response = await fetch('https://software.iqjita.com/pendingfee.php?mode=update_due_date', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  admission_number: currentStudent.admission_number,
                  installment_number: currentStudent.installment_number,
                  new_due_date: newDueDate
                })
              });

              const result = await response.json();
              if (result.status === 'success') {
                alert("Due date updated!");
                setIsPopupOpen(false);
                setNewDueDate("");
              } else {
                alert("Failed to update due date.");
              }
            }}>Update Due Date</button>

            <button onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {sendingType && (
        <div className="sending-modal-overlay">
          <div className="sending-modal">
            {sendingStatus === "sending" && (
              <>
                <div style={{ width: 200, margin: "0 auto" }}>
                  <Lottie animationData={animation1} loop={true} />
                </div>
                <p style={{ textAlign: "center" }}>
                  Sending {sendingType}... Please wait.
                </p>
              </>
            )}

            {sendingStatus === "success" && (
              <>
                {/* <div style={{ width: 120, margin: "0 auto" }}>
                  <Lottie animationData={animation1} loop={false} />
                </div> */}
                <p style={{ textAlign: "center" }}>
                  {sendingType.charAt(0).toUpperCase() + sendingType.slice(1)} sent successfully!
                </p>
              </>
            )}


            {sendingStatus === "error" && (
              <>
                <p>Failed to send {sendingType}. Please try again.</p>
                {/* <button onClick={() => {
            setSendingStatus(null);
            setSendingType(null);
          }}>
            Close
          </button> */}
              </>
            )}
            <button onClick={() => {
              setSendingStatus(null);
              setSendingType(null);
            }}>
              Close
            </button>

          </div>
        </div>
      )}


    </div>
  );
};

export default Pending;

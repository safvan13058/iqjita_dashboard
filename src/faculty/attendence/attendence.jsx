import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaClock, FaArrowLeft } from 'react-icons/fa';
import "./attendence.css";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const navigate = useNavigate();
  const employeeId =JSON.parse(localStorage.getItem('user'))?.username; // ✅ Or get dynamically

  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const batches = ['11 AM - 1 PM', '9 AM - 11 AM','2 PM - 4 PM']; // ✅ Make sure these match your DB!

  // useEffect(() => {
  //   fetch(`https://software.iqjita.com/get_students_by_designation.php?employee_id=${employeeId}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.success) {
  //         setStudents(data.students);
  //       } else {
  //         console.error(data.message);
  //       }
  //     })
  //     .catch(err => console.error(err));
  // }, []);
  const fetchStudents = () => {
    fetch(`https://software.iqjita.com/get_students_by_designation.php?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.students);
        } else {
          console.error(data.message);
        }
      })
      .catch(err => console.error(err));
  };
  
  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Filter students by batch + search term
  const filteredStudents = students.filter(student => {
    const matchesBatch = selectedBatch === 'All Batches' || student.batch_time === selectedBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  // ✅ When students or batch changes, set status:
  useEffect(() => {
    const initialStatus = {};
    students.forEach(student => {
      if (student.attendance_status) {
        initialStatus[student.admission_number] = student.attendance_status; // ✅ Existing DB value
      } else {
        initialStatus[student.admission_number] = 'absent'; // ✅ Default fallback
      }
    });
    setAttendanceStatus(initialStatus);
  }, [students, selectedBatch]);

  // ✅ When user clicks button → update status + call backend
  const handleStatusChange = (studentId, status) => {
    console.log("working")
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));

    fetch("https://software.iqjita.com/mark_attendance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        employee_id: employeeId,
        status: status,
        date: date,
        batch_time: selectedBatch
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          alert("Failed to save: " + data.message);
        } else {
          // ✅ Re-fetch students to get fresh status
          fetchStudents();
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="faculty-attendance-container">
      {/* Filters */}
      <div className="faculty-attendance-filters">
        <div className="faculty-date-picker">
          <div className="faculty-back-nav" onClick={() => navigate(-1)}>
            <FaArrowLeft className="faculty-back-icon" />
            <span>Back</span>
          </div>
          <div className="faculty-search-box">
            <FaSearch className="faculty-search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="faculty-batch-filter">
          <div className="faculty-batch-selector-scroll">
            <div className="faculty-batch-selector">
              <div
                className={`faculty-batch-tab ${selectedBatch === 'All Batches' ? 'active' : ''}`}
                onClick={() => setSelectedBatch('All Batches')}
              >
                All Batches
              </div>
              {batches.map(batch => (
                <div
                  key={batch}
                  className={`faculty-batch-tab ${selectedBatch === batch ? 'active' : ''}`}
                  onClick={() => setSelectedBatch(batch)}
                >
                  {batch}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h3>Students</h3>
      <div className="faculty-attendance-table">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.admission_number} className="faculty-attendance-row">
              <div className="faculty-student-photo">
                <img
                  src={student.photo ? `https://software.iqjita.com/${student.photo}` : 'https://via.placeholder.com/80?text=Photo'}
                  alt={student.name}
                />
              </div>
             <div className="faculty-student-name">
  <div className="student-name-text">{student.name}</div>
  <div className="student-id-text">ID: {student.admission_number}</div>
  <div className="student-id-text">Phone: {student.contact_number}</div>
  <div className="student-batch-text">Batch: {student.batch_time}</div>
</div>

              <div className="faculty-status-buttons">
                <button
                  className={`faculty-status-btn faculty-status-btn-Present ${attendanceStatus[student.admission_number] === 'present' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(student.admission_number, 'present')}
                >
                  <FaCheck /> Present
                </button>
                <button
                  className={`faculty-status-btn faculty-status-btn-late ${attendanceStatus[student.admission_number] === 'late' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(student.admission_number, 'late')}
                >
                  <FaClock /> Late
                </button>
                <button
                  className={`faculty-status-btn faculty-status-btn-absent ${attendanceStatus[student.admission_number] === 'absent' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(student.admission_number, 'absent')}
                >
                  <FaTimes /> Absent
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="faculty-no-results">No students found</div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;

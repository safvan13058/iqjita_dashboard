import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './students.css';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Computer Science');
  const [courses, setCourses] = useState(['Computer Science', 'Business Administration', 'Mechanical Engineering']);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null)
  const navigate = useNavigate();

  const handlePayment = (student) => {
    // Navigate to FeeForm page with student data as state
    navigate('/fee-payment', { state: { student } });
  };
  const fetchStudents = async (course) => {
    setLoading(true);
    setError(null);

    try {
        const response = await fetch("https://software.iqjita.com/administration.php?action=liststudentbycourse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ course })
        });

        // ✅ Read the raw response as text
        const text = await response.text();
        console.log("🔍 Raw API Response:", text);

        // ✅ Extract the second JSON object
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
            console.log("✅ Students Fetched Successfully:", result.students);
            setStudents(result.students || []);
        } else {
            throw new Error(result.message || "❌ Failed to fetch students.");
        }
    } catch (err) {
        setError(err.message);
        console.error("🚨 Error fetching students:", err);
    } finally {
        setLoading(false);
    }
};
const fetchStudentDetails = async (admissionNumber) => {
  setViewLoading(true);
  setViewError(null);

  try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=liststudentbyadmn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admn: admissionNumber })
      });

      // ✅ Read raw response as text
      const text = await response.text();
      console.log("🔍 Raw API Response:", text);

      // ✅ Extract the second JSON object
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
          console.log("✅ Student Details Fetched:", result.student);
          setSelectedStudent(result.student[0] || {}); // ✅ Ensure we get the first student object
      } else {
          throw new Error(result.message || "❌ Failed to fetch student details.");
      }
  } catch (err) {
      setViewError(err.message);
      console.error("🚨 Error fetching student details:", err);
  } finally {
      setViewLoading(false);
  }
};
const handleViewStudent = (admissionNumber) => {
  fetchStudentDetails(admissionNumber);
};

const handleCloseModal = () => {
  setSelectedStudent(null);
  setViewError(null);
};


  useEffect(() => {
    fetchStudents(selectedCourse);
  }, [selectedCourse]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm) ||
    student.admission_number.toString().includes(searchTerm) ||
    student.contact_number.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="students-container">
      <h1>Student Management</h1>
      
      <div className="controls">
        <h3>Student of {selectedCourse}</h3>
        <div className="search-filter">
          
          
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-select"
          >
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search students..."
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Loading students...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Admission No.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Parent Contact</th>
              <th>Email</th>
              <th>Course</th>
              <th>Fee</th>
              <th>Batch Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.admission_number}>
                  <td>{student.admission_number}</td>
                  <td>{student.name}</td>
                  <td>{student.contact_number}</td>
                  <td>{student.parent_contact}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>Rs.{student.final_fee}</td>
                  <td>{student.batch_time}</td>
                  <td>
                    <button className="action-btn view-btn"  onClick={() => handleViewStudent(student.admission_number)}>View</button>
                    <button className="action-btn edit-btn">Edit</button>
                    <button className="action-btn edit-btn" onClick={() => handlePayment(student)}>pay</button>
                  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  {students.length === 0 ? 'No students found for this course' : 'No matching students found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
   

    {selectedStudent && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-modal" onClick={handleCloseModal}>×</button>
          
          {viewLoading && <div className="loading">Loading student details...</div>}
          {viewError && <div className="error">Error: {viewError}</div>}
          
          {!viewLoading && !viewError && (
            <>
              <h2>Student Details</h2>
              <div className="student-details-grid">
                <div className="detail-section section1">
                  <div className='pr-container'>
                  <h3>Personal Information</h3>
                  <p><strong>Name:</strong> {selectedStudent.name}</p>
                  <p><strong>Admission Number:</strong> {selectedStudent.admission_number}</p>
                  <p><strong>Contact:</strong> {selectedStudent.contact_number}</p>
                  <p><strong>Parent Contact:</strong> {selectedStudent.parent_contact}</p>
                  <p><strong>Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Location:</strong> {selectedStudent.location}</p>
                  </div>
                  <div className='pr-image'>
                    <img src="" alt="" />
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Course Information</h3>
                  <p><strong>Course:</strong> {selectedStudent.course}</p>
                  <p><strong>Duration:</strong> {selectedStudent.duration} year(s)</p>
                  <p><strong>Batch Time:</strong> {selectedStudent.batch_time}</p>
                  <p><strong>Exact Fee:</strong>  {selectedStudent.exact_fee}</p>
                  <p><strong>Discount:</strong> {selectedStudent.discount}</p>
                  <p><strong>Final Fee:</strong> {selectedStudent.final_fee}</p>
                </div>

                <div className="detail-section">
                  <h3>Payment Information</h3>
                  <p><strong>Admission Fee:</strong> {selectedStudent.admission_fee}</p>
                  <p><strong>Total Paid:</strong>  {selectedStudent.TotalPaid}</p>
                  <p><strong>Total Pending:</strong>  {selectedStudent.TotalPending}</p>
                  
                  <h4>Installments</h4>
                  <p><strong>Installment 1:</strong>  {selectedStudent.install1} (Balance:  {selectedStudent.bal1})</p>
                  <p><strong>Installment 2:</strong>  {selectedStudent.install2} (Balance:  {selectedStudent.bal2})</p>
                  <p><strong>Installment 3:</strong> {selectedStudent.install3} (Balance:  {selectedStudent.bal3})</p>
                  <p><strong>Installment 4:</strong> {selectedStudent.install4} (Balance:  {selectedStudent.bal4})</p>
                  <p><strong>Installment 5:</strong> {selectedStudent.install5} (Balance: {selectedStudent.bal5})</p>
                </div>

                <div className="detail-section">
                  <h3>Additional Information</h3>
                  <p><strong>Address:</strong> {selectedStudent.address || 'N/A'}</p>
                  <p><strong>City:</strong> {selectedStudent.city || 'N/A'}</p>
                  <p><strong>District:</strong> {selectedStudent.district || 'N/A'}</p>
                  <p><strong>State:</strong> {selectedStudent.state || 'N/A'}</p>
                  <p><strong>Country:</strong> {selectedStudent.country || 'N/A'}</p>
                  <p><strong>Documents Submitted:</strong> {selectedStudent.documents_submitted || 'N/A'}</p>
                  <p><strong>Education Qualification:</strong> {selectedStudent.education_qualification || 'N/A'}</p>
                </div>
              </div>

              <div className="modal-footer">
                <button className="action-btn print-btn" onClick={() => window.print()}>
                  Print Details
                </button>
                <button className="action-btn close-btn" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}
     </div>


  );
};

export default StudentsPage;
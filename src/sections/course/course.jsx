import React, { useState, useEffect } from "react";
// import { PlusCircle } from 'react-feather';
import './course.css'; // Import the CSS file

const CourseForm = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course: "",
    duration: "",
    exact_fee: "",
    admission_fee: "",
    install1: "",
    install2: "",
    install3: "",
    install4: "",
    install5: "",
  });
  const user = JSON.parse(localStorage.getItem('user')); 
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
        const response = await fetch(
            "https://software.iqjita.com/administration.php?action=getcoursedetails"
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text(); // Read raw response
        console.log("Raw Response:", text); // Debugging: Check raw response

        // Trim leading/trailing spaces and attempt JSON parsing
        let data;
        try {
            data = JSON.parse(text.trim()); 
        } catch (jsonError) {
            throw new Error("Invalid JSON response: " + jsonError.message);
        }

        console.log("Parsed Data:", data);

        if (data.status === "success") {
            setCourses(data.courses);
            console.log("✅ Courses Fetched Successfully:", data.courses);
        } else {
            console.error("❌ Failed to fetch courses:", data);
            alert("Failed to fetch courses: " + (data.message || "Unknown error"));
        }
    } catch (error) {
        console.error("🚨 Error fetching courses:", error.message);
        alert("Failed to fetch courses. Please try again later.");
    } finally {
        setLoading(false);
    }
};



  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://software.iqjita.com/administration.php?action=course_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newCourse,
            updated_by: user.name,
          }),
        }
      );
      
      const text = await response.text(); // Read response as text first
      const jsonStartIndex = text.indexOf("{", text.indexOf("{") + 1); // Find second "{"
      const cleanJson = text.slice(jsonStartIndex); // Extract valid JSON part
      
      const data = JSON.parse(cleanJson); // Parse the cleaned JSON

      if (data.status === "success") {
        alert(data.message);
        setShowAddForm(false);
        setNewCourse({
          course: "",
          duration: "",
          exact_fee: "",
          admission_fee: "",
          install1: "",
          install2: "",
          install3: "",
          install4: "",
          install5: "",
        });
        fetchCourses();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course");
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="course-form-container">
      <h2 className="course-form-heading">Course Details</h2>
      
      <div className="course-form-controls">
        <div className="course-search-container">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="course-search-input"
          />
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="add-course-button"
        >
          {/* <PlusCircle size={18} className="add-course-icon" /> */}
          Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr className="course-table-header-row">
                <th className="course-table-header-cell">Course</th>
                <th className="course-table-header-cell">Duration</th>
                <th className="course-table-header-cell">Exact Fee</th>
                <th className="course-table-header-cell">Installment 1</th>
                <th className="course-table-header-cell">Installment 2</th>
                <th className="course-table-header-cell">Installment 3</th>
                <th className="course-table-header-cell">Installment 4</th>
                <th className="course-table-header-cell">Installment 5</th>
                <th className="course-table-header-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? "course-table-even-row" : "course-table-odd-row"}
                >
                  <td className="course-table-cell">{course.course}</td>
                  <td className="course-table-cell">{course.duration}</td>
                  <td className="course-table-cell">₹{parseFloat(course.exact_fee).toFixed(2)}</td>
                  <td className="course-table-cell">₹{parseFloat(course.install1).toFixed(2)}</td>
                  <td className="course-table-cell">₹{parseFloat(course.install2).toFixed(2)}</td>
                  <td className="course-table-cell">₹{parseFloat(course.install3).toFixed(2)}</td>
                  <td className="course-table-cell">₹{parseFloat(course.install4).toFixed(2)}</td>
                  <td className="course-table-cell">₹{parseFloat(course.install5).toFixed(2)}</td>
                  <td className="course-table-cell"><button>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <div className="add-course-modal">
          <div className="add-course-modal-content">
            <h3 className="add-course-modal-title">Add New Course</h3>
            <button
              className="add-course-close-button"
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>
            
            <form onSubmit={handleAddCourse} className="add-course-form">
  <div className="add-course-container">
    {/* Left Column */}
    <div className="add-course-column">
      <div className="add-course-form-group">
        <label className="add-course-label">Course Name:</label>
        <input
          type="text"
          name="course"
          value={newCourse.course}
          onChange={handleInputChange}
          required
          className="add-course-input"
        />
      </div>

      <div className="add-course-form-group">
        <label className="add-course-label">Duration:</label>
        <input
          type="text"
          name="duration"
          value={newCourse.duration}
          onChange={handleInputChange}
          required
          className="add-course-input"
        />
      </div>

      <div className="add-course-form-group">
        <label className="add-course-label">Exact Fee:</label>
        <input
          type="number"
          name="exact_fee"
          value={newCourse.exact_fee}
          onChange={handleInputChange}
          required
          step="0.01"
          className="add-course-input"
        />
      </div>

      <div className="add-course-form-group">
        <label className="add-course-label">Admission Fee:</label>
        <input
          type="number"
          name="admission_fee"
          value={newCourse.admission_fee}
          onChange={handleInputChange}
          required
          step="0.01"
          className="add-course-input"
        />
      </div>
    </div>

    {/* Right Column */}
    <div className="add-course-column">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="add-course-form-group">
          <label className="add-course-label">Installment {num}:</label>
          <input
            type="number"
            name={`install${num}`}
            value={newCourse[`install${num}`]}
            onChange={handleInputChange}
            required
            step="0.01"
            className="add-course-input"
          />
        </div>
      ))}
    </div>
  </div>

  <button type="submit" className="add-course-submit-button">
    Add Course
  </button>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;
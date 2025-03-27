import React from "react";

const CourseForm = ({ onBack }) => {
  return (
    <div className="form-container">
      <h2>Enroll in a Course</h2>
      <form>
        <input type="text" placeholder="Student Name" required />
        <input type="text" placeholder="Course Name" required />
        <input type="text" placeholder="Duration" required />
        <button type="submit">Enroll</button>
        <button type="button" onClick={onBack} className="back-button">⬅ Back</button>
      </form>
    </div>
  );
};

export default CourseForm;

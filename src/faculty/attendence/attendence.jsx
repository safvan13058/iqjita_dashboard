import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import "./attendence.css"
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // or any back icon you prefer

const AttendancePage = () => {
    const navigate = useNavigate();
    // Sample data
    const batches = ['Batch A', 'Batch B', 'Batch C', 'Batch D'];
    const students = [
        { id: 1, name: 'Rahul Sharma', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=RS', batch: 'Batch A' },
        { id: 2, name: 'Priya Patel', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=PP', batch: 'Batch A' },
        { id: 3, name: 'Amit Singh', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=AS', batch: 'Batch B' },
        { id: 4, name: 'Neha Gupta', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=NG', batch: 'Batch B' },
        { id: 5, name: 'Vikram Joshi', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=VJ', batch: 'Batch C' },
        { id: 6, name: 'Ananya Reddy', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=AR', batch: 'Batch C' },
        { id: 7, name: 'Suresh Kumar', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=SK', batch: 'Batch D' },
        { id: 8, name: 'Divya Mishra', photo: 'https://via.placeholder.com/80/0F6D66/FFFFFF?text=DM', batch: 'Batch D' },
    ];

    // State management
    const [selectedBatch, setSelectedBatch] = useState('All Batches');
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [showBatchDropdown, setShowBatchDropdown] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Filter students based on batch and search term
    const filteredStudents = students.filter(student => {
        const matchesBatch = selectedBatch === 'All Batches' || student.batch === selectedBatch;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesBatch && matchesSearch;
    });

    // Initialize attendance status
    useEffect(() => {
        const initialStatus = {};
        students.forEach(student => {
            initialStatus[student.id] = attendanceStatus[student.id] || 'present';
        });
        setAttendanceStatus(initialStatus);
    }, [selectedBatch]);

    // Handle attendance status change
    const handleStatusChange = (studentId, status) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    // Submit attendance
    const handleSubmit = () => {
        const attendanceRecord = {
            date,
            batch: selectedBatch,
            records: filteredStudents.map(student => ({
                studentId: student.id,
                status: attendanceStatus[student.id]
            }))
        };
        console.log('Attendance submitted:', attendanceRecord);
        alert('Attendance submitted successfully!');
    };

    return (
        <div className="faculty-attendance-container">
            {/* <h2 className="faculty-page-title">Mark Attendance</h2> */}

            {/* Filters */}
            <div className="faculty-attendance-filters">
                <div className="faculty-date-picker">
                    {/* <label>Date:{date}</label> */}
                    <div className="faculty-back-nav" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="faculty-back-icon" />
                        <span>Back</span>
                    </div>
                    {/* <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            readOnly
          /> */}
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
                    {/* <button
                        className="faculty-filter-button"
                        onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                    >
                        <FaFilter /> {selectedBatch}
                    </button> */}
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

            {/* Attendance Table */}
            
            <h3>Students</h3>
            <div className="faculty-attendance-table">
                {/* <div className="faculty-attendance-header">
                    <div>Photo</div>
                    <div>Student Name</div>
                    <div>Batch</div>
                    <div>Status</div>
                </div> */}


                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <div key={student.id} className="faculty-attendance-row">
                            <div className="faculty-student-photo">
                                <img src={student.photo} alt={student.name} />
                            </div>
                            <div className="faculty-student-name"><div>{student.name}</div><div>{student.name}</div><div>{student.name}</div></div>
                            {/* <div className="faculty-student-batch">{student.batch}</div> */}
                            <div className="faculty-status-buttons">
                                <button
                                    className={`faculty-status-btn faculty-status-btn-Present ${attendanceStatus[student.id] === 'present' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(student.id, 'present')}
                                >
                                    <FaCheck /> Present
                                </button>
                                <button
                                    className={`faculty-status-btn faculty-status-btn-late ${attendanceStatus[student.id] === 'late' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(student.id, 'late')}
                                >
                                    <FaClock /> Late
                                </button>
                                <button
                                    className={`faculty-status-btn faculty-status-btn-absent ${attendanceStatus[student.id] === 'absent' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                >
                                    <FaTimes /> Absent
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="faculty-no-results">No students found matching your criteria</div>
                )}
            </div>

            {/* Submit Button */}
            <div className="faculty-submit-container">
                <button className="faculty-submit-btn" onClick={handleSubmit}>
                    Submit Attendance
                </button>
            </div>

            {/* CSS Styles */}

        </div>
    );
};

export default AttendancePage;
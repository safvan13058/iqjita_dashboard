import React, { useEffect, useState } from 'react';
import './css.css';
import {
    FaUserCheck,
    FaUserTimes,
    FaUserClock,
    FaUsers,
    FaDownload,
    FaCalendarAlt,
    FaFilter,
    FaSearch
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClipLoader } from 'react-spinners';

const AttendancePage = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setError('');
        setLoading(true);
        setAttendanceData(null);

        let url = `https://software.iqjita.com/student_attent.php?date=${selectedDate}`;
        if (selectedCourse) url += `&course=${encodeURIComponent(selectedCourse)}`;
        if (selectedBatch) url += `&batch_time=${encodeURIComponent(selectedBatch)}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch attendance data');
                return res.json();
            })
            .then((data) => {
                setAttendanceData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate, selectedCourse, selectedBatch]);

  
    const exportPDF = () => {
        if (!attendanceData) return;

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm'
        });

        // Header
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text(`IQJITA INSTITUTE - ATTENDANCE REPORT`, 15, 15);

        doc.setFontSize(12);
        doc.text(`Date: ${attendanceData.date}`, 15, 22);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 28);

        // Summary section
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total Students: ${attendanceData.total_students}`, 200, 15);
        doc.text(`Present: ${attendanceData.total_present}`, 200, 21);
        doc.text(`Absent: ${attendanceData.total_absent}`, 200, 27);
        doc.text(`Late: ${attendanceData.total_late}`, 200, 33);

        // ✅ Correct: just run autoTable
        autoTable(doc, {
            head: [['Admission No.', 'Name', 'Contact', 'Parent Contact', 'Course', 'Batch', 'Status']],
            body: attendanceData.students.map((s) => [
                s.admission_number,
                s.name,
                s.contact_number,
                s.parent_contact,
                s.course,
                s.batch_time,
                {
                    content: s.status,
                    styles: {
                        textColor:
                            s.status === 'present'
                                ? [46, 125, 50]
                                : s.status === 'absent'
                                    ? [198, 40, 40]
                                    : [255, 143, 0],
                    },
                },
            ]),
            startY: 40,
            headStyles: {
                fillColor: [51, 51, 51],
                textColor: [255, 255, 255],
                fontSize: 10,
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            margin: { top: 40 },
        });

        // ✅ Safe: use doc.lastAutoTable.finalY
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 50;

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('© IQJITA Institute - Confidential', 15, finalY + 10);

        doc.save(`IQJITA_Attendance_${attendanceData.date.replace(/-/g, '_')}.pdf`);
    };



    const filteredStudents = attendanceData?.students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.admission_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.contact_number.includes(searchTerm) ||
            student.parent_contact.includes(searchTerm);

        const matchesStatus = selectedStatus === '' || student.status === selectedStatus;
        const matchesCourse = selectedCourse === '' || student.course === selectedCourse;
        const matchesBatch = selectedBatch === '' || student.batch_time === selectedBatch;

        return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
    }) || [];


    const courses = Array.from(new Set(attendanceData?.students?.map(s => s.course))) || [];
    const batches = Array.from(new Set(attendanceData?.students?.map(s => s.batch_time))) || [];
    return (
        <div className="student_atten-container">
            <header className="student_atten-header">
                <h1>Student Attendance Dashboard</h1>
                <div className="student_atten-actions">
                    <button onClick={exportPDF} className="student_atten-export-button">
                        <FaDownload /> Export Report
                    </button>
                </div>
            </header>



            {error && (
                <div className="student_atten-error-message">
                    <p>Error: {error}</p>
                    <button onClick={fetchData} className="student_atten-retry-button">
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="student_atten-loading-container">
                    <ClipLoader size={35} color="#2d7d32" />
                    <p>Loading attendance data...</p>
                </div>
            ) : attendanceData && (
                <>
                    <div className="student_atten-summary-cards">
                        <div className="student_atten-summary-card student_atten-present">
                            <div className="student_atten-card-content">
                                <FaUserCheck className="student_atten-card-icon" />
                                <div className="student_atten-card-stats">
                                    <h3>{attendanceData.total_present}</h3>
                                    <p>Present</p>
                                </div>
                            </div>
                            <div className="student_atten-card-footer">+2% from yesterday</div>
                        </div>

                        <div className="student_atten-summary-card student_atten-absent">
                            <div className="student_atten-card-content">
                                <FaUserTimes className="student_atten-card-icon" />
                                <div className="student_atten-card-stats">
                                    <h3>{attendanceData.total_absent}</h3>
                                    <p>Absent</p>
                                </div>
                            </div>
                            <div className="student_atten-card-footer">-1% from yesterday</div>
                        </div>

                        <div className="student_atten-summary-card student_atten-late">
                            <div className="student_atten-card-content">
                                <FaUserClock className="student_atten-card-icon" />
                                <div className="student_atten-card-stats">
                                    <h3>{attendanceData.total_late}</h3>
                                    <p>Late Arrivals</p>
                                </div>
                            </div>
                            <div className="student_atten-card-footer">No change</div>
                        </div>


                        <div className="student_atten-summary-card student_atten-total">
                            <div className="student_atten-card-content">
                                <FaUsers className="student_atten-card-icon" />
                                <div className="student_atten-card-stats">
                                    <h3>{attendanceData.total_students}</h3>
                                    <p>Total Students</p>
                                </div>
                            </div>
                            <div className="student_atten-card-footer">3 new this week</div>
                        </div>
                    </div>
                    <div className="student_atten-control-panel">
                        <div className="student_atten-filter-group">
                            <label className="student_atten-filter-label">
                                <FaCalendarAlt className="student_atten-filter-icon" />
                                <span className="student_atten-filter-text">Date</span>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="student_atten-date-input"
                                />
                            </label>

                            <label className="student_atten-filter-label">
                                <FaFilter className="student_atten-filter-icon" />
                                <span className="student_atten-filter-text">Course</span>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="student_atten-filter-select"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="student_atten-filter-label">
                                <FaFilter className="student_atten-filter-icon" />
                                <span className="student_atten-filter-text">Batch</span>
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="student_atten-filter-select"
                                >
                                    <option value="">All Batches</option>
                                    {batches.map(batch => (
                                        <option key={batch} value={batch}>{batch}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="student_atten-filter-label">
                                <FaFilter className="student_atten-filter-icon" />
                                <span className="student_atten-filter-text">Status</span>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="student_atten-filter-select"
                                >
                                    <option value="">All Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </label>
                        </div>

                        <div className="student_atten-search-group">
                            <FaSearch className="student_atten-search-icon" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="student_atten-search-input"
                            />
                        </div>
                    </div>


                    <div className="student_atten-table-container">
                        <table className="student_atten-table">
                            <thead>
                                <tr>
                                    <th>Admission No.</th>
                                    <th>Student Name</th>
                                    <th>Contact</th>
                                    <th>Parent Contact</th>
                                    <th>Course</th>
                                    <th>Batch</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.admission_number}>
                                            <td>{student.admission_number}</td>
                                            <td className="student_atten-student-name">{student.name}</td>
                                            <td>{student.contact_number}</td>
                                            <td>{student.parent_contact}</td>
                                            <td>{student.course}</td>
                                            <td>{student.batch_time}</td>
                                            <td>
                                                <span className={`student_atten-status-badge student_atten-${student.status}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="student_atten-no-results">
                                            No students found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="student_atten-table-footer">
                        <div className="student_atten-footer-info">
                            Showing {filteredStudents.length} of {attendanceData.students.length} records
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendancePage;
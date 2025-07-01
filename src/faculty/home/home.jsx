import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  FaUserGraduate, FaClipboardCheck, FaBell, FaCalendarAlt, FaBook,
  FaUmbrellaBeach, FaUsersCog
} from 'react-icons/fa';
import { MdOutlineEventAvailable, MdNotes } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './home.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FacHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [announcements, setAnnouncements] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [performanceData, setPerformanceData] = useState(null);
  const [notifications] = useState(3); // Example notification count
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    percentage: 0,
  });
 const employeeId = JSON.parse(localStorage.getItem('user'))?.username;
  useEffect(() => {
    fetch(`https://software.iqjita.com/get_students_by_designation.php?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // setStudents(data.students);
          setAttendanceStats({
            total: data.total_students,
            present: data.present,
            late: data.late,
            absent: data.absent,
            percentage: data.attendance_percentage
          });
        } else {
          console.error(data.message);
        }
      })
      .catch(err => console.error(err));
  }, []);
  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  // Load Announcements
  useEffect(() => {
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=list")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.announcements)) {
          const topThree = data.announcements.slice(0, 3).map(item => ({
            id: item.id,
            title: item.title,
            message: item.message,
            created_at: new Date(item.created_at)
          }));
          setAnnouncements(topThree);
        }
      })
      .catch(err => console.error("Failed to load announcements:", err));
  }, []);

  // Load Banners
  useEffect(() => {
    fetch('https://software.iqjita.com/bannerimage.php?type=staff')
      .then(res => res.json())
      .then(data => {
        const urls = data.map(item => item.image_url);
        setBannerImages(urls);
      })
      .catch(err => console.error('Failed to load banners:', err));
  }, []);

  // Rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Load Performance Graph (for non-Academics)
  useEffect(() => {
    if (user?.role !== "Academics") {
      fetch(`https://software.iqjita.com/hr/perfomancegraph_emp.php?employee_id=${user.username}`)
        .then(res => res.json())
        .then(data => {
          const labels = data.map(item => item.month);
          const values = data.map(item => item.total_score);
          const chartData = {
            labels,
            datasets: [
              {
                label: `${user.name}'s Performance`,
                data: values,
                backgroundColor: "#0F6D66",
                borderRadius: 6,
              },
            ],
          };
          setPerformanceData(chartData);
        })
        .catch(err => console.error("Failed to fetch performance data", err));
    }
  }, [user.username, user.name, user.role]);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${user.name}'s Monthly Performance`,
      },
    },
  };

  return (
    <div className="faculty-container">
      {/* Banner */}
      <div className="faculty-banner-container">
        <img
          src={bannerImages[currentImageIndex]}
          alt="Banner"
          className="faculty-banner-image"
        />
        <div className="faculty-banner-dots">
          {bannerImages.map((_, index) => (
            <span
              key={index}
              className={`faculty-dot ${index === currentImageIndex ? 'faculty-dot-active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Academics View */}
      {user.role === 'Academics' ? (
        <>
          {/* Quick Stats */}
          <div className="faculty-stats-container">
            <div className="faculty-stat-card">
              <FaUserGraduate className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Students</h3>
                <p className="faculty-stat-value">{attendanceStats.total}</p>
              </div>
            </div>

            <div className="faculty-stat-card">
              <FaClipboardCheck className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Attendance</h3>
                <p className="faculty-stat-value">{attendanceStats.percentage}%</p>
              </div>
            </div>

            <div className="faculty-stat-card">
              <MdOutlineEventAvailable className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Leave Requests</h3>
                <p className="faculty-stat-value">0</p> {/* Replace with dynamic leave count if you have it */}
              </div>
            </div>
          </div>

          {/* Academic Features */}
          <div className="faculty-features-container">
            <h5 className="faculty-section-title">Students</h5>
            <div className="faculty-features-grid">
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/attendence")}>
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <FaUserGraduate />
                </div>
                <h5>Attendance</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-secondary">
                  <MdOutlineEventAvailable />
                </div>
                <h5>Leave Requests</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <MdNotes />
                </div>
                <h5>Notes</h5>
              </div>
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/notifications")}>
                <div className="faculty-feature-icon faculty-feature-icon-secondary">
                  <FaBell />
                </div>
                <h5>Notifications</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <FaCalendarAlt />
                </div>
                <h5>Timetable</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-secondary">
                  <FaBook />
                </div>
                <h5>Lesson Plans</h5>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Performance Graph for Non-Academics */}
          <div className="performance-graph-container">
            <h3>{user.name}'s Performance</h3>
            {performanceData ? (
              <Bar data={performanceData} options={chartOptions} />
            ) : (
              <p style={{ padding: "10px", fontStyle: "italic" }}>Loading performance data...</p>
            )}
          </div>

          {/* Marketing Features */}
          {user.role === "Marketing" && (
            <div className="faculty-feature-card-marketing">
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/staffmarketing")}>
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <FaUsersCog />
                </div>
                <h5>Staff App</h5>
              </div>
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/stumarketing")}>
                <div className="faculty-feature-icon faculty-feature-icon-secondary">
                  <FaUserGraduate />
                </div>
                <h5>Student App</h5>
              </div>
            </div>
          )}
        </>
      )}

      {/* Announcements */}
      <div className="faculty-activity-container">
        <h5 className="faculty-section-title">Announcements</h5>
        <div className="faculty-activity-list">
          {announcements.length === 0 ? (
            <p style={{ padding: "10px", fontStyle: "italic" }}>No recent announcements</p>
          ) : (
            announcements.map((item, index) => (
              <div key={item.id} className="faculty-activity-item">
                <div className="faculty-activity-icon">
                  {index === 0 ? <FaBell /> : index === 1 ? <FaClipboardCheck /> : <MdNotes />}
                </div>
                <div>
                  <p className="faculty-activity-text">{item.title}</p>
                  <p className="faculty-activity-time">{formatTimeAgo(item.created_at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FacHome;

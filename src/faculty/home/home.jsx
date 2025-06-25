import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  FaUserGraduate, FaClipboardCheck, FaBell, FaCalendarAlt, FaBook,
  FaUmbrellaBeach
} from 'react-icons/fa';
import { MdOutlineEventAvailable, MdNotes } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Make sure your CSS is loaded
import { FaUsersCog } from "react-icons/fa";
const FacHome = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=list")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.announcements)) {
          // Get only the first 3 announcements
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
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // in minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  // Dynamic banner images
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    fetch('https://software.iqjita.com/bannerimage.php?type=staff')
      .then(res => res.json())
      .then(data => {
        const urls = data.map(item => item.image_url);
        setBannerImages(urls);
      })
      .catch(err => console.error('Failed to load banners:', err));
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notifications, setNotifications] = useState(3); // Example notification count

  // Rotate banner images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);
  const user = {
    name: "John Doe",
    // department: "Academics", // Not Academics
    department: "Marketing", // Not Academics
    performance: {
      Jan: 85,
      Feb: 90,
      Mar: 88,
      Apr: 80,
      May: 92,
      Jun: 87,
      Jul: 91,
      Aug: 89,
      Sep: 93,
      Oct: 86,
      Nov: 90,
      Dec: 94
    }
  };

  const labels = Object.keys(user.performance);
  const dataValues = Object.values(user.performance);

  const performanceData = {
    labels: labels,
    datasets: [
      {
        label: `${user.name}'s Performance`,
        data: dataValues,
        backgroundColor: '#0F6D66',
        borderRadius: 6,
      },
    ],
  };

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
      {/* Header */}
      {/* <header className="faculty-header">
        <div className="faculty-header-left">
          <FaChalkboardTeacher className="faculty-header-icon" />
          <h1 className="faculty-header-title">Teacher Portal</h1>
        </div>
        <div className="faculty-header-right">
          <div className="faculty-notification-badge">
            <IoMdNotifications className="faculty-notification-icon" />
            {notifications > 0 && <span className="faculty-badge">{notifications}</span>}
          </div>
          <button className="faculty-logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header> */}

      {/* Banner Carousel */}
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

      {/* Quick Stats */}
      {/* <div className="faculty-stats-container">
        <div className="faculty-stat-card">
          <FaUserGraduate className="faculty-stat-icon" />
          <div>
            <h3 className="faculty-stat-title">Students</h3>
            <p className="faculty-stat-value">42</p>
          </div>
        </div>
        <div className="faculty-stat-card">
          <FaClipboardCheck className="faculty-stat-icon" />
          <div>
            <h3 className="faculty-stat-title">Attendance</h3>
            <p className="faculty-stat-value">92%</p>
          </div>
        </div>
        <div className="faculty-stat-card">
          <MdOutlineEventAvailable className="faculty-stat-icon" />
          <div>
            <h3 className="faculty-stat-title">Leave Requests</h3>
            <p className="faculty-stat-value">2</p>
          </div>
        </div>
      </div> */}

      {/* Main Features */}
      {/* <div className="faculty-features-container">
        <h5 className="faculty-section-title">Students</h5>
        <div className="faculty-features-grid">
          <div
            className="faculty-feature-card"
            onClick={() => navigate("/faculty/attendence")}
            style={{ cursor: "pointer" }}
          >
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
          <div className="faculty-feature-card">
            <div className="faculty-feature-icon faculty-feature-icon-secondary"
             onClick={() => navigate("/faculty/notifications")}
            style={{ cursor: "pointer" }}>
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
      </div> */}
      {user.department === 'Academics' ? (
        <>
          {/* Quick Stats */}
          <div className="faculty-stats-container">
            <div className="faculty-stat-card">
              <FaUserGraduate className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Students</h3>
                <p className="faculty-stat-value">42</p>
              </div>
            </div>
            <div className="faculty-stat-card">
              <FaClipboardCheck className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Attendance</h3>
                <p className="faculty-stat-value">92%</p>
              </div>
            </div>
            <div className="faculty-stat-card">
              <MdOutlineEventAvailable className="faculty-stat-icon" />
              <div>
                <h3 className="faculty-stat-title">Leave Requests</h3>
                <p className="faculty-stat-value">2</p>
              </div>
            </div>
          </div>

          {/* Main Features */}
          <div className="faculty-features-container">
            <h5 className="faculty-section-title">Students</h5>
            <div className="faculty-features-grid">
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/attendence")} style={{ cursor: "pointer" }}>
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
              <div className="faculty-feature-card" onClick={() => navigate("/faculty/notifications")} style={{ cursor: "pointer" }}>
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
        <div className="performance-graph-container">
          <h3>{user.name}'s Performance</h3>
          <Bar data={performanceData} options={chartOptions} />
        </div>
      )}
      {user.department === "Marketing" && (
        <div className="faculty-feature-card-marketing">
          <div
            className="faculty-feature-card"
            onClick={() => navigate("/faculty/staffmarketing")}
            style={{ cursor: "pointer" }}
          >
            <div className="faculty-feature-icon faculty-feature-icon-primary">
              <FaUsersCog />
            </div>
            <h5>Staff App</h5>
          </div>
          <div className="faculty-feature-card">
            <div className="faculty-feature-icon faculty-feature-icon-secondary"
              onClick={() => navigate("/faculty/stumarketing")}
              style={{ cursor: "pointer" }}>
              <FaUserGraduate /> {/* Student App icon */}
            </div>
            <h5>Student App</h5>
          </div>
        </div>
      )}



      {/* Recent Activity */}
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
      );

    </div>
  );
};

export default FacHome;
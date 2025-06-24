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
const StuHome = () => {
  const navigate = useNavigate();
  // Dynamic banner images
  const bannerImages = [
    'https://via.placeholder.com/800x200/0F6D66/FFFFFF?text=Welcome+Back',
    'https://via.placeholder.com/800x200/9B5A2A/FFFFFF?text=Upcoming+Events',
    'https://via.placeholder.com/800x200/0F6D66/FFFFFF?text=New+Features',
    'https://via.placeholder.com/800x200/9B5A2A/FFFFFF?text=School+Updates',
    'https://via.placeholder.com/800x200/0F6D66/FFFFFF?text=Professional+Development'
  ];

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
        <>
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
          <div className="faculty-features-container">
            <h5 className="faculty-section-title">welcome {user.name}</h5>
            <div className="faculty-features-grid">
              <div className="faculty-feature-card" onClick={() => navigate("/students/attendence")} style={{ cursor: "pointer" }}>
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <FaUserGraduate />
                </div>
                <h5>Attendance</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-secondary">
                  <MdOutlineEventAvailable />
                </div>
                <h5>fee payment</h5>
              </div>
              <div className="faculty-feature-card">
                <div className="faculty-feature-icon faculty-feature-icon-primary">
                  <MdNotes />
                </div>
                <h5>Notes</h5>
              </div>
              <div className="faculty-feature-card" onClick={() => navigate("/students/notifications")} style={{ cursor: "pointer" }}>
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
                <h5>review</h5>
              </div>
            </div>
          </div>
        </>
     
     



      {/* Recent Activity */}
      <div className="faculty-activity-container">
        <h5 className="faculty-section-title">Announcements</h5>
        <div className="faculty-activity-list">
          <div className="faculty-activity-item">
            <div className="faculty-activity-icon">
              <FaBell />
            </div>
            <div>
              <p className="faculty-activity-text">New leave request from Student A</p>
              <p className="faculty-activity-time">10 minutes ago</p>
            </div>
          </div>
          <div className="faculty-activity-item">
            <div className="faculty-activity-icon">
              <FaClipboardCheck />
            </div>
            <div>
              <p className="faculty-activity-text">Attendance marked for Class 5B</p>
              <p className="faculty-activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="faculty-activity-item">
            <div className="faculty-activity-icon">
              <MdNotes />
            </div>
            <div>
              <p className="faculty-activity-text">New notes uploaded for Mathematics</p>
              <p className="faculty-activity-time">Yesterday</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StuHome;
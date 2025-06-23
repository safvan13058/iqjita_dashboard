import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardCheck, FaStickyNote, FaBell, FaSignOutAlt, FaCalendarAlt, FaBook } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { MdNotes, MdOutlineEventAvailable } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import "./home.css"
const FacHome = () => {
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
             onClick={() => navigate("/faculty/LeavePage")}
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
      </div>

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

export default FacHome;
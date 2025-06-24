import React, { useState } from "react";
import "./notifications.css";

const mockNotifications = [
  {
    id: 1,
    title: "Salary Credited",
    message: "Your salary for June has been credited.",
    timestamp: "2025-06-23 09:15 AM",
    read: false
  },
  {
    id: 2,
    title: "Attendance Reminder",
    message: "Don't forget to mark your attendance today.",
    timestamp: "2025-06-22 08:00 AM",
    read: true
  },
  {
    id: 3,
    title: "New HR Policy",
    message: "Please review the updated HR policies.",
    timestamp: "2025-06-20 04:30 PM",
    read: false
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div
          className="faculty-back-nav"
          onClick={() => window.history.back()} // or use navigation method based on your router
        >
          ← Back
        </div>
        <h2>Notifications</h2>
        <span className="notification-count">
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <svg className="bell-icon" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-card ${notif.read ? '' : 'unread'}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="notification-indicator"></div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notif.title}</h3>
                  <span className="notification-time">{notif.timestamp}</span>
                </div>
                <p className="notification-message">{notif.message}</p>
              </div>
              <button
                className="notification-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

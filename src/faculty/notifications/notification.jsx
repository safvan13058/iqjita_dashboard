import React, { useEffect, useState } from "react";
import "./notifications.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch from API on load
  useEffect(() => {
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=list")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.announcements.map(item => ({
            id: item.id,
            title: item.title,
            message: item.message,
            timestamp: new Date(item.created_at).toLocaleString(),
            read: false // Optional: manage with DB or state
          }));
          setNotifications(formatted);
        } else {
          console.error("Failed to fetch announcements");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

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
        <div className="faculty-back-nav" onClick={() => window.history.back()}>
          ← Back
        </div>
        <h2>Notifications</h2>
        <span className="notification-count">
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
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

import React, { useEffect, useState } from "react";
import "./HrAnnouncement.css";

const HrAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    send_sms: false,
    send_email: false,
    send_push: false,
    send_whatsapp: false,
  });

  // Fetch announcements
  useEffect(() => {
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnouncements(data.announcements);
      });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, selectedCourses: ["Staff"] }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnnouncements((prev) => [
            { ...form, id: Date.now(), created_at: new Date().toISOString() },
            ...prev,
          ]);
          setForm({
            title: "",
            message: "",
            send_sms: false,
            send_email: false,
            send_push: false,
            send_whatsapp: false,
          });
        } else {
          alert("Failed to create announcement");
        }
      });
  };

  // Delete announcement
  const handleDelete = (id) => {
    fetch("https://software.iqjita.com/hr/staff_announcements_api.php?action=delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    });
  };

  return (
    <div className="hr-announcement-container">
      <h2 className="hr-announcement-heading">Staff Announcements</h2>

      <form className="hr-announcement-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="hr-announcement-input"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          className="hr-announcement-textarea"
          value={form.message}
          onChange={handleChange}
          required
        />

        <div className="hr-announcement-options">
          <label>
            <input
              type="checkbox"
              name="send_sms"
              checked={form.send_sms}
              onChange={handleChange}
            /> SMS
          </label>
          <label>
            <input
              type="checkbox"
              name="send_email"
              checked={form.send_email}
              onChange={handleChange}
            /> Email
          </label>
          <label>
            <input
              type="checkbox"
              name="send_push"
              checked={form.send_push}
              onChange={handleChange}
            /> Push
          </label>
          <label>
            <input
              type="checkbox"
              name="send_whatsapp"
              checked={form.send_whatsapp}
              onChange={handleChange}
            /> WhatsApp
          </label>
        </div>

        <button type="submit" className="hr-announcement-button">Send Announcement</button>
      </form>

      <div className="hr-announcement-list">
        {announcements.length === 0 ? (
          <p className="hr-announcement-empty">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div className="hr-announcement-card" key={a.id}>
              <div className="hr-announcement-card-header">
                <h3>{a.title}</h3>
                <span>{new Date(a.created_at).toLocaleString()}</span>
              </div>
              <p>{a.message}</p>
              <div className="hr-announcement-tags">
                {a.send_sms && <span className="tag">SMS</span>}
                {a.send_email && <span className="tag">Email</span>}
                {a.send_push && <span className="tag">Push</span>}
                {a.send_whatsapp && <span className="tag">WhatsApp</span>}
              </div>
              <button
                className="hr-announcement-delete"
                onClick={() => handleDelete(a.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HrAnnouncement;

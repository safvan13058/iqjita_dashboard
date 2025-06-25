import React, { useState, useEffect } from "react";
import "./announcement.css";

// const coursesList = [
//   "DIPLOMA IN OFFICE ADMINISTRATION (OFFLINE)",
//   "DIPLOMA IN OFFICE ADMINISTRATION (ONLINE)",
//   "DIPLOMA IN DIGITAL MARKETING",
//   "DIPLOMA IN DIGITAL MARKETING & BRANDING",
//   "DIPLOMA IN GRAPHIC DESIGNING",
//   "DIPLOMA IN VIDEO EDITING",
//   "DIPLOMA IN CORPORATE ADVERTISING & GRAPHIC DESIGNING",
//   "ADVANCED DIPLOMA IN FULL STACK DEVELOPMENT",
//   "ADVANCED DIPLOMA IN DESIGNING",
//   "ADVANCED DIPLOMA IN DEVELOPMENT",
//   "ADVANCED DIPLOMA IN LOGISTICS & SUPPLY CHAIN MANAGEMENT",
//   "PG DIPLOMA IN LOGISTICS & SUPPLY CHAIN MANAGEMENT",
//   "PG DIPLOMA IN HUMAN RESOURCE MANAGEMENT (OFFLINE)",
//   "PG DIPLOMA IN HUMAN RESOURCE MANAGEMENT (ONLINE)",
//   "ADVANCED DIPLOMA IN MARKETING & SALES",
//   "ADVANCED DIPLOMA IN AI & DATA SCIENCE",


// ];

const AnnouncementPanel = () => {
  const [coursesList, setCoursesList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    selectedCourses: [],
    send_sms: false,
    send_email: false,
    send_push: false,
    send_whatsapp: false,
  });

  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=getcoursedetails");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.status === "success" && Array.isArray(data.courses)) {
        const courseNames = data.courses.map(course => course.course);
        setCoursesList(courseNames);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };
  const API_URL = "https://software.iqjita.com/announcement_api.php";
  // Load recent announcements (dummy for now)
  useEffect(() => {
    fetch(`${API_URL}?action=list`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.announcements);
        } else {
          console.error("Failed to fetch announcements");
        }
      })
      .catch(err => console.error("Error loading announcements:", err));
  }, []);
const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
        const response = await fetch('https://software.iqjita.com/announcement_api.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Announcement deleted");
            // Refresh announcements
            setAnnouncements((prev) => prev.filter((item) => item.id !== id));
        } else {
            alert("Error deleting announcement: " + data.message);
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "selectedCourses") {
      const options = [...e.target.selectedOptions].map((o) => o.value);
      setFormData({ ...formData, selectedCourses: options });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)

    try {
      const response = await fetch(`${API_URL}?action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response)
      const result = await response.json();
      
      if (result.success) {
        alert("Announcement sent!");

        // Clear form
        setFormData({
          title: "",
          message: "",
          selectedCourses: [],
          send_sms: false,
          send_email: false,
          send_push: false,
          send_whatsapp: false,
        });

        // Refresh announcements
        const res = await fetch(`${API_URL}?action=list`);
        const data = await res.json();
        if (data.success) {
          setAnnouncements(data.announcements);
        }
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {

      console.error("Submit error:", error);
      alert("Network error while sending announcement.");
    }
  };

  return (
    <div className="announcement-container">
      <h2> Announcements</h2>

      <form className="announcement-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <label>Select Courses:</label>
        <div className="checkbox-list-wrapper">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.selectedCourses.length === coursesList.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({ ...formData, selectedCourses: coursesList });
                } else {
                  setFormData({ ...formData, selectedCourses: [] });
                }
              }}
            />
            Select All
          </label>

          <div className="checkbox-list">
            {coursesList.map((course) => (
              <label key={course} className="checkbox-item">
                <input
                  type="checkbox"
                  value={course}
                  checked={formData.selectedCourses.includes(course)}
                  onChange={(e) => {
                    const updatedCourses = e.target.checked
                      ? [...formData.selectedCourses, course]
                      : formData.selectedCourses.filter((c) => c !== course);

                    setFormData({ ...formData, selectedCourses: updatedCourses });
                  }}
                />
                {course}
              </label>
            ))}
          </div>
        </div>




        <label>Send Via:</label>
        <div className="channels">
          <label>
            <input
              type="checkbox"
              name="send_sms"
              checked={formData.send_sms}
              onChange={handleChange}
            />
            SMS
          </label>
          <label>
            <input
              type="checkbox"
              name="send_email"
              checked={formData.send_email}
              onChange={handleChange}
            />
            Email
          </label>
          <label>
            <input
              type="checkbox"
              name="send_push"
              checked={formData.send_push}
              onChange={handleChange}
            />
            Push Notification
          </label>
          <label>
            <input
              type="checkbox"
              name="send_whatsapp"
              checked={formData.send_whatsapp}
              onChange={handleChange}
            />
            WhatsApp
          </label>
        </div>

        <button type="submit" className="send-btn">Send Announcement</button>
      </form>

      <div className="recent-announcements">
        <h3>Recent Announcements</h3>
        <ul>
          {announcements.map((a, idx) => (
            <li key={idx}>
              <strong>{a.title}</strong> <span>({a.created_at})</span>
              <p>{a.message}</p>

              <button onClick={() => handleDelete(a.id)} style={{ color: 'red', marginTop: '5px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AnnouncementPanel;

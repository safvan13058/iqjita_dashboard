import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { IoHomeOutline } from "react-icons/io5";
const Sidebar = () => {
  const location = useLocation();

  // Define your navigation items
  const navItems = [
    { path: "/", label: "Home", icon: <IoHomeOutline /> },
    { path: "/students", label: "Students", icon: "👨‍🎓" },
    { path: "/faculty", label: "Faculty", icon: "👩‍🏫" },
    { path: "/sales", label: "Sales", icon: "💰" },
    { path: "/accounts", label: "Accounts", icon: "📊" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* <div className="sidebar-footer">
        <div className="theme-selector">
          <label htmlFor="theme-select">Theme:</label>
          <select id="theme-select" className="theme-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
          </select>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
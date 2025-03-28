import React, { useState, useEffect } from "react";
import "./nav.css";
import "../common/colour.css";
import { useAuth } from "../login/auth";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.png'
const Navbar = () => {
  const [theme, setTheme] = useState("light-theme");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("selected-theme") || "light-theme";
    setTheme(savedTheme);
    document.body.classList.add(savedTheme);
  }, []);

  // Change Theme Function
  const changeTheme = (e) => {
    const newTheme = e.target.value;
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
    setTheme(newTheme);
    localStorage.setItem("selected-theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left side - Logo and main links */}
      <div className="navbar-left">
        <div className="navbar-logo"><img src={logo} alt="" /></div>
      </div>

      {/* Right side - Search, theme, and profile */}
      <div className="navbar-right">
        <div className="profile-container">
          <div className="navprofile">
            <div className="profilename">
              <h5>Mohamed safvan vp</h5>
              <p className="profilerole">admin</p>
            </div>
            <div
              className="profile-icon"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <img
                src="https://via.placeholder.com/32"
                alt="Profile"
                className="profile-pic"
              />
            </div>
          </div>

          {profileMenuOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <img
                  src="https://via.placeholder.com/64"
                  alt="Profile"
                  className="dropdown-profile-pic"
                />
                <div className="profile-info">
                  <div className="profile-name">John Doe</div>
                  <div className="profile-email">john@example.com</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">My Account</a>
              <a href="#" className="dropdown-item">Settings</a>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
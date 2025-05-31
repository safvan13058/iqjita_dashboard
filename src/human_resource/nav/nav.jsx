import React, { useState, useEffect } from "react";
import "./nav.css";
import "../../sections/common/colour.css";
import { useAuth } from "../../sections/login/auth";
import { useNavigate } from "react-router-dom";
import logo from '../../sections/images/logo2.png'
import profiles from '../../sections/images/profile.png'
import pic1 from '../../sections/images/profile_pic/pic1.png'
import pic2 from '../../sections/images/profile_pic/pic2.png'
import pic3 from '../../sections/images/profile_pic/pic3.png'
import pic4 from '../../sections/images/profile_pic/pic7.png'
import pic5 from '../../sections/images/profile_pic/pic5.png'
import pic6 from '../../sections/images/profile_pic/pic6.png'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Navbar = () => {
  const [theme, setTheme] = useState("light-theme");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [profile, setProfile] = useState( localStorage.getItem(`profile_${user.id}`)||profiles );
  const [showPopup, setShowPopup] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);

  console.log("user==", user);
  const defaultImages = [
    pic1,
    pic2,
    profiles,
    pic4,
    pic5,
    pic6
  ];
  useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    setShowOnlineBanner(true);
    setTimeout(() => setShowOnlineBanner(false), 2000); // show online banner for 2 seconds
  };

  const handleOffline = () => {
    setIsOnline(false);
    setShowOnlineBanner(false); // hide online banner immediately
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

  const handleSelectImage = (img) => {
    setProfile(img);
    localStorage.setItem(`profile_${user.id}`, img);
    // setShowPopup(false);
  };
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

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (editMode) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';

      if (formData.newPassword) {
        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      profilePic: profilePic,
    };

    if (formData.newPassword) {
      // Handle password change logic here
      console.log('Password changed');
    }

    // onSave(updatedUser);
    setEditMode(false);
  };

  return (
  
    <nav className="navbarhr">
    {(!isOnline || showOnlineBanner) && (
  <div className={`network-status ${isOnline ? 'online' : 'offline'}  ${
      isOnline ? 'slide-in' : 'slide-in'
    }`}>
    {isOnline ? 'Online' : 'offline'}
  </div>
)}

      {/* Left side - Logo and main links */}
      <div className="navbar-left">
        <div className="navbar-logo"><img src={logo} alt="" /></div>
      </div>

      {/* Right side - Search, theme, and profile */}
      <div className="navbar-right">
        <div className="profile-container">
          <div className="navprofile">
            <div className="profilename">
              <h5>{user.name}</h5>
              {console.log("name==", user.name)}
              <p className="profilerole">{user.role}</p>
            </div>
            <div
              className="profile-icon"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <img
                src={profile}
                alt="Profile"
                className="hrprofile-pic"
              />
            </div>
          </div>

          {profileMenuOpen && (
            <div className="hrprofile-dropdown">
              <div className="hrdropdown-header">
                <img
                  src={profile}
                  alt="Profile"
                  className="dropdown-profile-pic"
                />
                <div className="profile-info">
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-email">{user.role}</div>
                </div>
              </div>
              <div className="hrdropdown-divider"></div>
              <a href="#" className="hrdropdown-item" onClick={(e) => {
                e.preventDefault();
                setProfileMenuOpen(false);
                setShowAccountPopup(true);
              }}>
                My Account
              </a>
              <a href="#" className="hrdropdown-item">Settings</a>
              <div className="hrdropdown-divider"></div>
              <button className="hrdropdown-item logout-item" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
          {showAccountPopup && (
           
            <div className="account-popup-overlay">
              <div className="account-popup-hr">
                <button className="close-btn clos-pro" onClick={() => setShowAccountPopup(false)} >×</button>

                <div className="profile-header-hr">
                  <div className="profile-container">
                    <img src={profile || "/default-profile.png"} alt="Profile" className="profile-pics" />
                    <button className="edit-icon" onClick={() => setShowPopup(true)}>
                      ✏️ {/* You can replace this with an actual icon */}
                    </button>
                  </div>
                  <div className="name-card-hr">
                  <h2>{user.name}</h2>
                  <p>{user.role}</p>
                  </div>
                </div>
              

              <form onSubmit={handleSubmit}>
                <div className="hrform-group">
                  <label>Name</label>

                  <div className="form-valuehr">{user.name}</div>

                </div>

                <div className="hrform-group">
                  <label>Email Address</label>
                  <div className="form-value">{user.email}</div>
                </div>

                <div className="hrform-group">
                  <label>Branch</label>
                  <div className="form-value">{user.branch.name},{user.branch.address}</div>
                </div>
              </form>
            </div>
         </div>
          )}
           {/* Popup Modal */}
      {showPopup && (
        <div className="hrprofile-popup-overlay">
          <div className="hrprofile-popup">
            <h3>Select a Profile Picture</h3>
            <button className="profile-edit-close-btn" onClick={() => setShowPopup(false)}>×</button>
            <div className="hrimage-pre-pic">
              <img src={profile} alt="profile" />
            </div>
            <div className="image-grid">
              {defaultImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Profile ${index + 1}`}
                  className="default-image"
                  onClick={() => handleSelectImage(img)}
                />
              ))}
            </div>
            
          </div>
        </div>
      )}
      </div>
    
    </div>

    </nav >

  );
};

export default Navbar;
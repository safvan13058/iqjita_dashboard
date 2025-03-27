// import React, { useState, useEffect } from "react";
// import "./nav.css";
// import "../common/colour.css"; // Import the theme styles

// const Navbar = () => {
//   const [theme, setTheme] = useState("light-theme");
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Load saved theme from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("selected-theme") || "light-theme";
//     setTheme(savedTheme);
//     document.body.classList.add(savedTheme);
//   }, []);

//   // Change Theme Function
//   const changeTheme = (e) => {
//     const newTheme = e.target.value;

//     document.body.classList.remove(theme);
//     document.body.classList.add(newTheme);

//     setTheme(newTheme);
//     localStorage.setItem("selected-theme", newTheme);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">My Dashboard</div>

//       {/* <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//         ☰
//       </button>

//       <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
//         <li><a href="#">Home</a></li>
//         <li><a href="#">About</a></li>
//         <li><a href="#">Services</a></li>
//         <li><a href="#">Contact</a></li>
//         <li>
//           <select className="theme-select" onChange={changeTheme} value={theme}>
//             <option value="light-theme">Light</option>
//             <option value="dark-theme">Dark</option>
//             <option value="blue-theme">Blue</option>
//             <option value="red-theme">Red</option>
//             <option value="purple-theme">Purple</option>
//             <option value="yellow-theme">Yellow</option>
//           </select>
//         </li>
//       </ul> */}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import "./nav.css";
import "../common/colour.css";

const Navbar = () => {
  const [theme, setTheme] = useState("light-theme");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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

  return (
    <nav className="navbar">
      {/* Left side - Logo and main links */}
      <div className="navbar-left">
        <div className="navbar-logo">My Dashboard</div>
        
        {/* <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul> */}
      </div>

      {/* Right side - Search, theme, and profile */}
      <div className="navbar-right">
        {/* <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div> */}

        {/* <div className="theme-select-container">
          <select className="theme-select" onChange={changeTheme} value={theme}>
            <option value="light-theme">Light</option>
            <option value="dark-theme">Dark</option>
            <option value="blue-theme">Blue</option>
            <option value="red-theme">Red</option>
          </select>
        </div> */}

        <div className="profile-container">
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
              <a href="#" className="dropdown-item">Sign out</a>
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
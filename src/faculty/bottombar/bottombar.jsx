import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./bottombar.css";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserTie, FaUmbrellaBeach, FaMoneyCheckAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const Bottombar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/faculty", label: "Home", icon: <IoHomeOutline /> },
    { path: "/faculty/attendence", label: "Employee", icon: <FaUserTie /> },
    { path: "/faculty/profile", label: "Attendance", icon: <MdAccessTime /> },
    { path: "/faculty/SalaryPage", label: "Leave", icon: <FaUmbrellaBeach /> },
    { path: "/faculty/LeavePage", label: "Payroll", icon: <FaMoneyCheckAlt /> },
  ];

  return (
    <div className="fac-bottombar">
      <nav className="fac-bottombar-nav">
        <div className="fac-bottombar-scrollable-nav">
          {navItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              className={`fac-nav-link ${location.pathname === item.path ? "fac-active" : ""}`}
              title={item.label} 
            >
              <span className="fac-nav-icon">{item.icon}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Bottombar;

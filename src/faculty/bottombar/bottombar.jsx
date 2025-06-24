import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./bottombar.css";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserTie, FaUmbrellaBeach, FaMoneyCheckAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi"; // For profile/employee
import { RiCalendarCheckLine } from "react-icons/ri"; // For attendance
import { MdOutlinePayments } from "react-icons/md"; // For payroll
import { TbMoneybag } from "react-icons/tb"; // For salary
import { FaBell } from "react-icons/fa"; 
const user = {
  department: "HR" // Change to "Academics" to test
};
const Bottombar = () => {
  const location = useLocation();

  const navItems = [
   { path: "/faculty", label: "Home", icon: <IoHomeOutline /> },
   {
    path: user.department === "Academics"
      ? "/faculty/attendence"
      : "/faculty/notifications",
    label: user.department === "Academics"
      ? "Attendance"
      : "Notifications",
    icon: user.department === "Academics"
      ? <RiCalendarCheckLine />
      : <FaBell />
  },
  { path: "/faculty/profile", label: "Profile", icon: <BiSolidUserDetail /> },
  { path: "/faculty/LeavePage", label: "Leave", icon: <FaUmbrellaBeach /> },
  { path: "/faculty/SalaryPage", label: "Salary", icon: <TbMoneybag /> },
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
              <span className="fac-nav-label">{item.label}</span>
            </Link>

          ))}
        </div>
      </nav>
    </div>
  );
};

export default Bottombar;

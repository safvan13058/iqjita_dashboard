import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { IoHomeOutline } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { MdOutlinePersonOutline, MdAccountBalanceWallet } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaGraduationCap, FaHourglassHalf } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { FaUserTie, FaUmbrellaBeach, FaMoneyCheckAlt, FaRegCalendarAlt, FaChartLine } from "react-icons/fa";
import { MdAccessTime, MdTrendingUp, MdEmail } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { path: "/hr", label: "Dashboard", icon: <IoHomeOutline /> },
    { path: "/hr/employees", label: "Employee", icon: <FaUserTie /> },
    { path: "/hr/attendance", label: "Attendance", icon: <MdAccessTime /> },
    { path: "/hr/leave", label: "Leave", icon: <FaUmbrellaBeach /> },
    { path: "/hr/payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
    { path: "/hr/performance", label: "Performance", icon: <MdTrendingUp /> },
    { path: "/hr/calendar", label: "Calendar", icon: <FaRegCalendarAlt /> },
    { path: "/hr/mailbox", label: "Mail Box", icon: <MdEmail /> },
  ];

  return (
    <div className={`sidebarhr ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </div>

      <nav className="sidebar-navhr">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`nav-linkhr ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-iconhr">{item.icon}</span>
            {isOpen && <span className="nav-labelhr">{item.label}</span>}
          </Link>


        ))}
        <div className="sidebar-footerhr">
          <Link to="/" className="nav-linkhr">
            <span className="nav-iconhr">
              <FiChevronLeft />
            </span>
            {isOpen && <span className="nav-labelhr">Back</span>}
          </Link>
        </div>
      </nav>

    </div>
  );
};

export default Sidebar;

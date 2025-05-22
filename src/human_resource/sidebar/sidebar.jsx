import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { IoHomeOutline } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { MdOutlinePersonOutline, MdAccountBalanceWallet } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaGraduationCap, FaHourglassHalf } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { path: "/hr", label: "Dashboard", icon: <IoHomeOutline /> },
    { path: "/hr/employees", label: "Employee", icon: <PiStudentFill /> },
    { path: "/hr/attendance", label: "Attendance", icon: <FaHourglassHalf /> },
    { path: "/hr/Leave", label: "Leave", icon: <MdOutlinePersonOutline /> },
    { path: "/hr/Payroll", label: "Payroll", icon: <BsGraphUpArrow /> },
    { path: "/hr/Performance", label: "Performance", icon: <MdAccountBalanceWallet /> },
    { path: "/hr/Expense", label: "Expense", icon: <FaGraduationCap /> },
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

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { IoHomeOutline } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { MdPending } from 'react-icons/md';
import { MdOutlinePersonOutline, MdAccountBalanceWallet, MdOutlinePeopleAlt } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaGraduationCap, FaHourglassHalf } from "react-icons/fa";
import { FaBullhorn, FaUserShield, FaUsers, FaUserTie ,FaUserCheck} from "react-icons/fa";
// import { BsGraphUpArrow } from "react-icons/bs";
import { GiGraduateCap } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi";

import logo from '../images/logo.png'
const Sidebar = () => {
  const location = useLocation();

  // Define your navigation items
  const navItems = [
    { path: "/", label: "Home", icon: <IoHomeOutline /> },
    { path: "/students", label: "Students", icon: <PiStudentFill /> },
    { path: "/pending", label: "Pending Fee", icon: <FaHourglassHalf style={{ fontSize: '18px' }} /> },
    { path: "/stuattent", label: "Attendance", icon: <FaUserCheck style={{ fontSize: '18px' }} /> },
    { path: "/AnnouncementPanel", label: "Announcements", icon: <FaBullhorn /> },
    { path: "/sales", label: "Sales", icon: <BsGraphUpArrow /> },
    { path: "/accounts", label: "Accounts", icon: <MdAccountBalanceWallet /> },
    { path: "/alumni", label: "Alumni", icon: <GiGraduateCap /> },
    { path: "/hrhr", label: "Human Resources", icon: <RiTeamLine /> },
    { path: "/usermanage", label: "User Manage", icon: <FaUserShield /> },
  ];

  return (
    <div className="sidebar">
      {/* <div className="sidebar-header">
          <div className="navbar-logo"><img src={logo} alt="" /></div>
      </div> */}

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
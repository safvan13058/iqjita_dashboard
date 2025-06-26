import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserTie, FaUmbrellaBeach, FaMoneyCheckAlt, FaRegCalendarAlt } from "react-icons/fa";
import { MdAccessTime, MdTrendingUp, MdEmail } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaBullhorn, FaUserShield, FaUsers } from "react-icons/fa";
const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [unreadLeaveCount, setUnreadLeaveCount] = useState(0);

  useEffect(() => {
  const fetchUnreadCount = () => {
    fetch("https://software.iqjita.com/hr/leave_api.php?action=count_unread")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUnreadLeaveCount(parseInt(data.unread_count));
        }
      })
      .catch((err) => console.error("Failed to fetch unread leave count", err));
  };

  // Initial call
  fetchUnreadCount();

  // Set interval
  const interval = setInterval(fetchUnreadCount, 3000); // every 3 seconds

  // Cleanup
  return () => clearInterval(interval);
}, []);


  const navItems = [
    { path: "/hr", label: "Dashboard", icon: <IoHomeOutline /> },
    { path: "/hr/employees", label: "Employee", icon: <FaUserTie /> },
    { path: "/hr/attendance", label: "Attendance", icon: <MdAccessTime /> },
    { path: "/hr/HrAnnouncement", label: "Announcement", icon: <FaBullhorn /> },
    { path: "/hr/leave", label: "Leave", icon: <FaUmbrellaBeach /> },
    { path: "/hr/payroll", label: "Payroll", icon: <FaMoneyCheckAlt /> },
    { path: "/hr/performance", label: "Performance", icon: <MdTrendingUp /> },
    { path: "/hr/calendar", label: "Calendar", icon: <FaRegCalendarAlt /> },
    { path: "/hr/mailbox", label: "Mail Box", icon: <MdEmail /> },
    { path: "/hr/exemployees", label: "Ex-Employee", icon: <FaUserTie /> },
  ];

  return (
    <div className={`sidebarhr ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </div>

      <nav className="sidebar-navhr">
        <div className="sidebar-scrollable-nav">
          {navItems.map((item) => {
            const isLeave = item.path === "/hr/leave";
            return (
              <Link
                to={item.path}
                key={item.path}
                className={`nav-linkhr ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-iconhr">
                  {item.icon}
                  {isLeave && unreadLeaveCount > 0 && (
                    <span className="unread-badge">
                      {unreadLeaveCount >= 9 ? "9+" : unreadLeaveCount}
                    </span>
                  )}
                </span>
                {isOpen && <span className="nav-labelhr">{item.label}</span>}
              </Link>
            );
          })}
        </div>
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

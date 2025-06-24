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

const Bottombar = () => {
    const location = useLocation();

    const navItems = [
        { path: "/students", label: "Home", icon: <IoHomeOutline /> },
        { path: "/students/notification", label: "Notifications", icon: <FaBell /> },
        { path: "/students/fees", label: "Fee Payment", icon: <FaMoneyCheckAlt /> },
        { path: "/students/profile", label: "Profile", icon: <BiSolidUserDetail /> },

        //   { path: "/students/payment-history", label: "History", icon: <MdHistory /> },
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

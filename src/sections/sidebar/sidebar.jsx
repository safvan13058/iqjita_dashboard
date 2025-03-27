import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <button className="btn">Home</button>
      </Link>
      <Link to="/students">
        <button className="btn">Students</button>
      </Link>
      <Link to="/faculty">
        <button className="btn">Faculty</button>
      </Link>
      <Link to="/sales">
        <button className="btn">Sales</button>
      </Link>
      <Link to="/accounts">
        <button className="btn">Accounts</button>
      </Link>
    </div>
  );
};

export default Sidebar;

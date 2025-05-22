// layout/HrLayout.jsx
import Sidebar from '../sidebar/sidebar'; // your separate sidebar for HR
import Nav from '../nav/nav'
import { Outlet } from 'react-router-dom';

const HrLayout = () => (
  <div style={{ display: 'flex' }}>
    <Nav/>
    < Sidebar />
    <div className="main-content hrmaincontent  collapsed expanded " style={{  padding: "20px", paddingTop: "60px" }}>
            <Outlet />
          </div>
  </div>
);

export default HrLayout;

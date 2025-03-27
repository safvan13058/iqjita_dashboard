import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import "./home.css";
import AdmissionForm from "../admission/admission"; 
import FeeForm from "../fees/fees";
import CourseForm from "../course/course";
import { useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Home = () => {
  const navigate = useNavigate(); 
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="dashboard-containers">
      {/* Show the selected form */}
      {activeForm === "admission" && <AdmissionForm onBack={() => setActiveForm(null)} />}
      {activeForm === "fee" && <FeeForm onBack={() => setActiveForm(null)} />}
      {activeForm === "course" && <CourseForm onBack={() => setActiveForm(null)} />}

      {/* Show dashboard if no form is selected */}
      {!activeForm && (
        <>
          {/* Top Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card" onClick={() => navigate("/admission")}>
              <h2>ADMISSION</h2>
            </div>

            <div className="stat-card" onClick={() => navigate("/fee-payment")}>
              <h2>Fee Payment</h2>
            </div>

            <div className="stat-card" onClick={() => navigate("/course")}>
              <h2>Course</h2>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-container">
            <div className="chart-box">
              <h3>Pie Chart</h3>
              <Doughnut data={pieChartData} />
            </div>
            <div className="chart-box">
              <h3>Chart Order</h3>
              <Line data={lineChartData} />
              <button className="save-report">💾 Save Report</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* === Pie Chart Data === */
const pieChartData = {
  labels: ["Total Order", "Customer Growth", "Total Revenue"],
  datasets: [
    {
      data: [81, 22, 62],
      backgroundColor: ["#ff6384", "#4caf50", "#36a2eb"]
    }
  ]
};

/* === Line Chart Data === */
const lineChartData = {
  labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  datasets: [
    {
      label: "Orders",
      data: [200, 400, 456, 300, 500, 600, 700],
      borderColor: "#36a2eb",
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)"
    }
  ]
};

export default Home;

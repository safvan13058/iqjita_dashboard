import React from 'react';
import './dashboard.css'; // Make sure this file exists
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Dashboard = () => {
  const datas = {
    labels: ['John Doe', 'Jane Smith', 'Alex Green', 'Mia Rose'],
    datasets: [
      {
        label: 'Performance Score',
        data: [85, 90, 75, 95],
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Soft blue
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#333' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#333' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };
  const data = {
    totalEmployees: 58,
    presentToday: 52,
    upcomingLeaves: [
      { name: "John Doe", date: "2025-05-12" },
      { name: "Jane Smith", date: "2025-05-13" },
    ],
    announcements: [
      { title: "New Holiday Added", date: "2025-05-10" },
      { title: "Performance Reviews Next Week", date: "2025-05-09" },
    ],
  };

  return (
    <div className="dashboard-container">
     
      <div className="card-grid">
        <div className="card">
          <h2 className="card-heading">Total Employees</h2>
          <p className="card-value">{data.totalEmployees}</p>
        </div>
        <div className="card">
          <h2 className="card-heading">Present Today</h2>
          <p className="card-value">{data.presentToday}</p>
        </div>
        <div className="card">
          <h2 className="card-heading">Absent Today</h2>
          <p className="card-value">{data.presentToday}</p>
        </div>
        <div className="card">
          <h2 className="card-heading">Present Today</h2>
          <p className="card-value">{data.presentToday}</p>
        </div>
      </div>
      
      <div className='hrsection2'>
      <div className="hrchart">
      <Bar data={datas} options={options} />
    </div>
    <div className='notifications'></div>
    </div>

    </div>
  );
};

export default Dashboard;

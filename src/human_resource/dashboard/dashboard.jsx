import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animation1 from '../images/notify.json';
import profileimg from '../../sections/images/profile_pic/pic1.png';

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [images, setImages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0,
  });

  // Fetch summary data
  useEffect(() => {
    fetch('https://software.iqjita.com/hr/dashboard_summary.php')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Failed to fetch dashboard summary:', err));
  }, []);

  // Fetch notifications
  useEffect(() => {
    fetch('https://software.iqjita.com/hr/notifications.php')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        }
      })
      .catch((error) => console.error('Failed to load notifications:', error));
  }, []);

  // Fetch and process performance graph
  useEffect(() => {
    fetch('https://software.iqjita.com/hr/performancegraph.php?type=thismonth')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;

        const employees = Object.keys(data[0]).filter(k => k !== 'name');

        const scores = employees.map(emp =>
          data.reduce((sum, item) => sum + ((item[emp]?.score) || 0), 0)
        );

        const imageUrls = employees.map(emp =>
          typeof data.find(item => item[emp]?.image)?.[emp]?.image === 'string'
            ? data.find(item => item[emp]?.image)?.[emp]?.image
            : null
        );

        const transformedData = {
          labels: employees,
          datasets: [
            {
              label: 'Performance Score',
              data: scores,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              barThickness: 20,
              categoryPercentage: 0.8,
              barPercentage: 0.9,
            },
          ],
        };

        setChartData(transformedData);

        // Preload images
        Promise.all(
          imageUrls.map(url =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = typeof url === 'string' && url.startsWith('http') ? url : '/images/default.png';
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
            })
          )
        ).then(imgs => setImages(imgs));
      })
      .catch(err => console.error('Error fetching chart data:', err));
  }, []);

  // Chart image plugin
  const drawImagesPlugin = {
    id: 'drawImagesPlugin',
    afterDatasetsDraw(chart) {
      if (!images.length || !chartData || images.length !== chartData.labels.length) return;
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((bar, index) => {
        const img = images[index];
        if (!img) return;

        const maxImgHeight = 20;
        const scale = maxImgHeight / img.height;
        const imgWidth = img.width * scale;
        const imgHeight = maxImgHeight;

        const x = bar.x + 5;
        const y = bar.y - imgHeight / 2;

        ctx.drawImage(img, x, y, imgWidth, imgHeight);
      });
    },
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#333' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#333' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Summary Cards */}
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
          <p className="card-value">{data.absentToday}</p>
        </div>
        <div className="card">
          <h2 className="card-heading">On Leave</h2>
          <p className="card-value">{data.onLeaveToday}</p>
        </div>
      </div>

      {/* Performance Chart & Notifications */}
      <div className='hrsection2'>
        <div className="hrchart" style={{ height: '100%' }}>
          {chartData ? (
            <Bar data={chartData} options={options} plugins={[drawImagesPlugin]} />
          ) : (
            <p style={{ color: 'white' }}>Loading chart...</p>
          )}
        </div>

        <div className='notifications'>
          <div className='notification-content-hr'>
            {notifications.length > 0 ? (
              notifications.map((item, index) => (
                <div className="notfy-card" key={index}>
                  <div className='notfy-img'>
                    <img
                      src={item.image && item.image.startsWith('http') ? item.image : profileimg}
                      alt={item.name}
                    />
                  </div>
                  <div className='notfy-content'>
                    <h2>{item.type}</h2>
                    <p>{item.name}</p>
                    <p>{item.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='no-notifications'>
                <Lottie animationData={animation1} loop={true} style={{ height: 300, width: 300 }} />
                <p>No notifications to show</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

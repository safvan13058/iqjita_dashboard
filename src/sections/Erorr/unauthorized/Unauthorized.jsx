import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'; // Ensure this CSS file is created for styling
import img from './401.png';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleGoHome = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-img">
          <img src={img} alt="Unauthorized Access" className="error-image" />
        </div>
        <h1 className="error-title">401 - Unauthorized</h1>
        <p className="error-message">You do not have permission to access this page.</p>
        <div className="action-buttons">
          <button onClick={handleGoBack} className="btn btn-back">
            Go Back
          </button>
          <button onClick={handleGoHome} className="btn btn-home">
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

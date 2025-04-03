import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'; // Create this CSS file for styling
import img from './401_img.jpg'
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate('/login'); // Navigate to home page
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-img">
            <img src={img} alt="" />
        </div>
        
        <div className="action-buttons">
          <button onClick={handleGoBack} className="btn btn-back">
            Go Back
          </button>
          <button onClick={handleGoHome} className="btn btn-home">
            Go to Loginpage
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
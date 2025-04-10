import React from 'react';
import './loading.css';
import logo from '../images/logo.png'
const LoadingPage = () => {
  return (
    <div className="loader-container">
      <div className='loading'>
        <div className="load-logo"><img src={logo} alt="IQJITA" /></div>
        <div className="line-loader">
          <div className="line-inner"></div>
        </div>
      </div>


    </div>
  );
};

export default LoadingPage;

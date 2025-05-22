import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BodyBackgroundHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if route starts with /hr
    if (location.pathname.startsWith('/hr')) {
      document.body.style.backgroundColor = 'var(--hr-background-dark)';
    } else {
      document.body.style.backgroundColor = ''; // Reset or set default
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default BodyBackgroundHandler;

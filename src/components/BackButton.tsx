import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BackButton.css';

interface BackButtonProps {
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ children = 'Go Back'}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    
    if (location.state?.fromGrid && typeof location.state.page === 'number') {
      const page = location.state.page;
      navigate(`/pokegrid/${page}`);
    } else {
      navigate('/');
    }
  };

  return (
    <button className="back-button" onClick={handleGoBack}>
      &#8592; {children}
    </button>
  );
};

export default BackButton;
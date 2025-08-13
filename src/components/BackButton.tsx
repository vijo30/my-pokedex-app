
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

interface BackButtonProps {
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ children = 'Go Back' }) => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      &#8592; {children}
    </button>
  );
};

export default BackButton;
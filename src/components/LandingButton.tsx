import React, { type ReactNode } from 'react';
import '../styles/LandingButton.css';

interface LandingButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const LandingButton: React.FC<LandingButtonProps> = ({ onClick, children }) => {
  return (
    <button className="btn--landing" onClick={onClick}>
      {children}
    </button>
  );
};

export default LandingButton;
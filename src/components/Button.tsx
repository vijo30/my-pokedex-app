import React from 'react';
import '../styles/Button.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="reusable-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
import React from 'react';
import { typeColors } from '../utils/colors';
import '../styles/TypeBadge.css';

interface TypeBadgeProps {
  type: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const color = typeColors[type.toLowerCase()] || '#808080';
  
  return (
    <div className="type-badge" style={{ backgroundColor: color }}>
      {type}
    </div>
  );
};

export default TypeBadge;
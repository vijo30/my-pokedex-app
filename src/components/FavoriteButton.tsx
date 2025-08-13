import React from 'react';
import '../styles/FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''}`}
      aria-label="Toggle favorite"
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
import '../styles/Loader.css';
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="pokeball-loader" />
      <p>Loading Pokédex...</p>
    </div>
  );
};

export default Loader;
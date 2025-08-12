import React from 'react';

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
  };
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <h3 className="pokemon-name">{pokemon.name}</h3>
    </div>
  );
};

export default PokemonCard;
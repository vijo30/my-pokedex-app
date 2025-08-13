import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isFavorite, onToggleFavorite }) => {
  const pokemonId = pokemon.url.split('/')[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <div className="pokemon-card">
      <Link to={`/pokedex/${pokemonId}`} className="pokemon-card-link">
        <img src={imageUrl} alt={pokemon.name} className="pokemon-image" />
        <h3 className="pokemon-name">{pokemon.name}</h3>
      </Link>
      <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />
    </div>
  );
};

export default PokemonCard;
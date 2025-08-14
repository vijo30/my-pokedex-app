import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import '../styles/PokemonCard.css'
import { getPokemonImageUrl, handleImageError } from '../utils/pokemonImage';

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  currentPage: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isFavorite, onToggleFavorite, currentPage}) => {;
  const pokemonId = pokemon.url.split('/')[6];
  const imageUrl = getPokemonImageUrl(pokemonId);

  return (
    <div className="pokemon-card">
      <Link to={`/pokedex/${pokemonId}`} state={{ fromGrid: true, page: currentPage }} className="pokemon-card-link">
        <img src={imageUrl} alt={pokemon.name} className="pokemon-grid-image" onError={handleImageError}/>
        <h3 className="pokemon-grid-name">{pokemon.name}</h3>
      </Link>
      <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />
    </div>
  );
};

export default PokemonCard;
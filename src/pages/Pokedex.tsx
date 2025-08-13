import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import type { PokemonDetails } from '../types/pokemon';
import { formatPokemonValue } from '../utils/format';
import '../styles/Pokedex.css';
import BackButton from '../components/BackButton';

const Pokedex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailsResponse, speciesResponse] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        ]);

        if (!detailsResponse.ok || !speciesResponse.ok) {
          throw new Error('Could not fetch Pokémon data.');
        }

        const detailsData: PokemonDetails = await detailsResponse.json();
        const speciesData = await speciesResponse.json();

        const flavorTextEntry = speciesData.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        const cleanDescription = flavorTextEntry?.flavor_text.replace(/\n|\f/g, ' ') || 'No description available in English.';

        setPokemon(detailsData);
        setDescription(cleanDescription);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading || !pokemon) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  const formattedTypes = pokemon.types.map(t => t.type.name).join(', ');
  
 return (
    <div className="pokedex-container">
      <div className="back-button-container">
        <BackButton />
      </div>

      <div className="pokedex-card">
        <div className="pokemon-header">
          <h1 className="pokemon-name">{pokemon.name}</h1>
          <p className="pokemon-id">Pokémon No: {pokemon.id}</p>
          <img
            src={pokemon.sprites.front_default}
            alt={`${pokemon.name} sprite`}
            className="pokemon-image"
          />
        </div>

        <div className="pokemon-details">
          <div className="pokemon-info">
            <p>Type: {formattedTypes}</p>
            <p>Height (HT): {formatPokemonValue(pokemon.height, 'm')}</p>
            <p>Weight (WT): {formatPokemonValue(pokemon.weight, 'kg')}</p>
          </div>
          {description && <p className="pokemon-description">Description: {description}</p>}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
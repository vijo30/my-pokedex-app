import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import '../styles/Pokedex.css';

interface Pokemon {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  flavor_text_entries?: { flavor_text: string; language: { name: string } }[];
}

const Pokedex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      setError(null);
      try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokemonResponse.ok) {
          throw new Error("Couldn't fetch Pokémon information.");
        }
        const pokemonData: Pokemon = await pokemonResponse.json();
        setPokemon(pokemonData);

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (speciesResponse.ok) {
          const speciesData = await speciesResponse.json();
          const flavorTextEntry = speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === 'en'
          );
          setDescription(flavorTextEntry?.flavor_text.replace(/\n|\f/g, ' ') || 'No description is available.');
        } else {
          setDescription("Couldn't fetch description.");
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPokemonData();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!pokemon) {
    return <div>No se encontró la información del Pokémon.</div>;
  }

  const formatHeight = (height: number) => `${(height / 10).toFixed(1)} m`;
  const formatWeight = (weight: number) => `${(weight / 10).toFixed(1)} kg`;
  const formattedTypes = pokemon.types.map(t => t.type.name).join(', ');

  return (
    <div className="pokedex-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &#8592; Back
      </button>

      <div className="pokedex-card">
        <h1 className="pokemon-name">{pokemon.name}</h1>
        <p className="pokemon-id">N°: {pokemon.id}</p>
        <img
          src={pokemon.sprites.front_default}
          alt={`${pokemon.name} sprite`}
          className="pokemon-image"
        />
        <div className="pokemon-info">
          {description && <p className="pokemon-description">Description: {description}</p>}
          <p>Type: {formattedTypes}</p>
          <p>Height (HT): {formatHeight(pokemon.height)}</p>
          <p>Weight (WT): {formatWeight(pokemon.weight)}</p>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
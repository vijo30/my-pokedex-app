import { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';

interface Pokemon {
  name: string;
  url: string;
}

const PokeGrid = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon list');
        }
        const data = await response.json();
        setPokemonList(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
        setLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="poke-grid-container">
      <h1 className="poke-grid-title">Pokémon Grid</h1>
      <div className="poke-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokeGrid;
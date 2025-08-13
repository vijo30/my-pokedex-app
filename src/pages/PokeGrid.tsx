import { useState, useEffect, useCallback } from 'react';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import '../styles/PokeGrid.css'
import type { PokemonBase } from '../types/pokemon';


const ITEMS_PER_PAGE = 30;

const PokeGrid = () => {
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );

  const fetchPokemonList = useCallback(async (newOffset: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${newOffset}`);
      if (!response.ok) {
        throw new Error('Pokemon List could not be loaded!');
      }
      const data = await response.json();
      setPokemonList(data.results);
      setHasNextPage(!!data.next);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemonList(offset);
  }, [offset, fetchPokemonList]);

  useEffect(() => {
    let listToFilter = pokemonList;

    if (filterFavorites) {
      listToFilter = listToFilter.filter(pokemon => favorites.includes(pokemon.name));
    }

    const filtered = listToFilter.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [pokemonList, searchTerm, filterFavorites, favorites]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setOffset(prevOffset => prevOffset + ITEMS_PER_PAGE);
    }
  };
  const handlePreviousPage = () => {
    if (offset > 0) {
      setOffset(prevOffset => prevOffset - ITEMS_PER_PAGE);
    }
  };
  const handleToggleFavorite = (pokemonName: string) => {
    const newFavorites = favorites.includes(pokemonName)
      ? favorites.filter(fav => fav !== pokemonName)
      : [...favorites, pokemonName];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  

  return (
    <div className="poke-grid-container" data-testid="poke-grid-container">
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onToggleFavorites={() => setFilterFavorites(prev => !prev)}
        filterFavorites={filterFavorites}
      />
      {filteredPokemon.length > 0 ? (
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.name)}
            onToggleFavorite={() => handleToggleFavorite(pokemon.name)}
          />
        ))}
        </div>
      ) : (
        <div className="no-results-message">No Pokémon found.</div>
      )}
      <Pagination
        hasPrevious={offset > 0}
        hasNext={hasNextPage}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </div>
  );
};

export default PokeGrid;
import { useState, useEffect, useCallback, useReducer } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import '../styles/PokeGrid.css';
import type { PokemonBase } from '../types/pokemon';

const ITEMS_PER_PAGE = 30;

type State = {
  searchTerm: string;
  filterFavorites: boolean;
};

type Action =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'TOGGLE_FAVORITES' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'TOGGLE_FAVORITES':
      return { ...state, filterFavorites: !state.filterFavorites };
    default:
      return state;
  }
};

const PokeGrid = () => {
  const { page } = useParams<{ page: string }>();
  const currentPage = Number(page) || 1;
  const navigate = useNavigate();
  const location = useLocation();

  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const [cachedPokemon, setCachedPokemon] = useState<Record<number, PokemonBase[]>>({});

  const initialSearchTerm = new URLSearchParams(location.search).get('search') || '';
  const initialFilterFavorites = new URLSearchParams(location.search).get('favorites') === 'true';

  const [state, dispatch] = useReducer(reducer, {
    searchTerm: initialSearchTerm,
    filterFavorites: initialFilterFavorites,
  });

  const { searchTerm, filterFavorites } = state;

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const fetchPokemonList = useCallback(async (newOffset: number, pageNum: number) => {
    if (cachedPokemon[pageNum]) {
      setPokemonList(cachedPokemon[pageNum]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${newOffset}`);
      if (!response.ok) {
        throw new Error('Pokemon List could not be loaded!');
      }
      const data = await response.json();
      const results = data.results;

      setCachedPokemon(prevCache => ({
        ...prevCache,
        [pageNum]: results
      }));
      setPokemonList(results);
      setHasNextPage(!!data.next);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cachedPokemon]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (filterFavorites) {
      params.set('favorites', 'true');
    }
    if (filterFavorites && currentPage > 1) {
      navigate(`?${params.toString()}`);
    } else {
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [searchTerm, filterFavorites, navigate, currentPage]);

  useEffect(() => {
    if (!filterFavorites) {
      fetchPokemonList(offset, currentPage);
    } else {
      setLoading(false);
    }
  }, [offset, fetchPokemonList, filterFavorites, currentPage]);

  const [favorites, setFavorites] = useState<{ id: string; name: string }[]>(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );

  const getFilteredAndDisplayList = (): PokemonBase[] => {
    let listToFilter = filterFavorites
      ? favorites.map(fav => ({ name: fav.name, url: `https://pokeapi.co/api/v2/pokemon/${fav.id}/` }))
      : pokemonList;

    return listToFilter.filter(pokemon =>
      pokemon && pokemon.name && pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredPokemon = getFilteredAndDisplayList();

  const handleNextPage = () => {
    if (hasNextPage) {
      const params = new URLSearchParams(location.search);
      navigate(`/pokegrid/${currentPage + 1}?${params.toString()}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const params = new URLSearchParams(location.search);
      navigate(`/pokegrid/${currentPage - 1}?${params.toString()}`);
    }
  };

  const handleToggleFavorite = (pokemon: PokemonBase) => {
    const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
    if (!pokemonId) return;

    const newFavorites = favorites.some(fav => fav.id === pokemonId)
      ? favorites.filter(fav => fav.id !== pokemonId)
      : [...favorites, { id: pokemonId, name: pokemon.name }];
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
        onSearch={(term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term })}
        onToggleFavorites={() => dispatch({ type: 'TOGGLE_FAVORITES' })}
        filterFavorites={filterFavorites}
      />
      {filteredPokemon.length > 0 ? (
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              isFavorite={favorites.some(fav => fav.name === pokemon.name)}
              onToggleFavorite={() => handleToggleFavorite(pokemon)}
              currentPage={currentPage}
            />
          ))}
        </div>
      ) : (
        <div className="no-results-message">No Pokémon found.</div>
      )}
      <Pagination
        hasPrevious={currentPage > 1 && !filterFavorites}
        hasNext={hasNextPage && !filterFavorites}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </div>
  );
};

export default PokeGrid;
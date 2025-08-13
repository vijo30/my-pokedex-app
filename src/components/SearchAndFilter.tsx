import React from 'react';
import Button from './Button';
import '../styles/SearchAndFilter.css';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onToggleFavorites: () => void;
  filterFavorites: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearch,
  onToggleFavorites,
  filterFavorites,
}) => {
  return (
    <div className="search-filter-container">
      <input
        type="text"
        placeholder="Filter..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <Button onClick={onToggleFavorites} variant={filterFavorites ? 'primary' : 'secondary'}>
        {filterFavorites ? 'Show All' : 'Show Only Favorites'}
      </Button>
    </div>
  );
};

export default SearchAndFilter;
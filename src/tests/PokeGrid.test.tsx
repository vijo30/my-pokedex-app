import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokeGrid from '../pages/PokeGrid';
import { vi } from 'vitest';

const mockPokemonList = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};


const mockInitialPage = {
  results: [{ name: 'bulbasaur', url: '...' }],
  next: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
  previous: null,
};

const mockNextPage = {
  results: [{ name: 'pikachu', url: '...' }],
  next: 'https://pokeapi.co/api/v2/pokemon?offset=60&limit=30',
  previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=30',
};

vi.stubGlobal('fetch', vi.fn());

describe('PokeGrid', () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockPokemonList), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  it('renders a card for each Pokémon with its name and image', async () => {
    render(
      <MemoryRouter>
        <PokeGrid />
      </MemoryRouter>
    );

    const bulbasaurName = await screen.findByText(/bulbasaur/i);
    expect(bulbasaurName).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png');
  });

  it('should display pagination buttons and fetch the next page', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockInitialPage), { status: 200, headers: { 'Content-Type': 'application/json' }, }));
    
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockNextPage), { status: 200, headers: { 'Content-Type': 'application/json' }, }));

    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    await screen.findByText(/bulbasaur/i);

    const prevButton = screen.queryByRole('button', { name: /Previous/i });
    expect(prevButton).toBeNull();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);

    const newPokemon = await screen.findByText(/pikachu/i);
    expect(newPokemon).toBeInTheDocument();

    const updatedPrevButton = screen.getByRole('button', { name: /Previous/i });
    expect(updatedPrevButton).toBeEnabled();
  });

  it('should allow marking a pokemon as favorite and filtering by it', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockPokemonList), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      
      render(<MemoryRouter><PokeGrid /></MemoryRouter>);

      await screen.findByText(/bulbasaur/i);
      await screen.findByText(/ivysaur/i);

      
      const favoriteButton = screen.getAllByLabelText(/Toggle favorite/i)[0];
      
      fireEvent.click(favoriteButton);
      
      const filterButton = screen.getByRole('button', { name: /Show Only Favorites/i });
      fireEvent.click(filterButton);

      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.queryByText(/ivysaur/i)).toBeNull();
  });

  it('should filter the list of pokemon based on search input', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockPokemonList), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      
      render(<MemoryRouter><PokeGrid /></MemoryRouter>);

      const bulbasaur = await screen.findByText(/bulbasaur/i);
      const ivysaur = await screen.findByText(/ivysaur/i);

      const searchInput = screen.getByPlaceholderText(/Filter/i );
      fireEvent.change(searchInput, { target: { value: 'bulb' } });

      
      expect(bulbasaur).toBeInTheDocument();
      expect(ivysaur).not.toBeInTheDocument();
  });
});


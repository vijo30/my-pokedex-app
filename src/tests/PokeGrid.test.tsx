import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokeGrid from '../pages/PokeGrid';
import PokemonCard from '../components/PokemonCard';
import { vi } from 'vitest';

const mockPokemonList = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPokemonList),
  })
));

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

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(mockInitialPage),
})));

describe('PokeGrid', () => {
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
    expect(images[1]).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png');
  });

  it('should display pagination buttons and fetch the next page', async () => {
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    // Espera a que la página inicial cargue
    const prevButton = await screen.findByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Verifica el estado inicial de los botones
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    // Mockeamos la siguiente respuesta de la API
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockNextPage),
    });

    // Dispara el evento de clic y espera a que el contenido cambie
    fireEvent.click(nextButton);
    const newPokemon = await screen.findByText(/pikachu/i);

    expect(newPokemon).toBeInTheDocument();
  });

  it('should allow marking a pokemon as favorite and filtering by it', async () => {
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    // Espera a que los Pokémon carguen
    await screen.findByText(/bulbasaur/i);

    const bulbasaurCard = screen.getByText(/bulbasaur/i).closest('.pokemon-card');
    const favoriteButton = getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton);

    const filterButton = screen.getByRole('button', { name: /show favorites/i });
    fireEvent.click(filterButton);

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.queryByText(/ivysaur/i)).not.toBeInTheDocument();
  });

  it('should filter the list of pokemon based on search input', async () => {
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    await screen.findByText(/bulbasaur/i);
    await screen.findByText(/ivysaur/i);

    const searchInput = screen.getByRole('textbox', { name: /search pokemon/i });
    fireEvent.change(searchInput, { target: { value: 'bulb' } });

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.queryByText(/ivysaur/i)).not.toBeInTheDocument();
  });
});

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('PokemonCard', () => {
  it('navigates to the Pokedex details page on click', () => {
    const mockPokemon = { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' };

    const { getByRole } = render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );

    const cardLink = getByRole('link', { name: /bulbasaur/i });
    fireEvent.click(cardLink);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/pokedex/1');
  });

  it('applies the correct CSS class for the grid layout after loading', async () => {
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    const gridContainer = await screen.findByTestId('poke-grid-container');

    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('poke-grid-container');
  });
});
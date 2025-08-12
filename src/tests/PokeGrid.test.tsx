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
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
  ],
};

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPokemonList),
  })
));

describe('PokeGrid', () => {
  it('renders a card for each Pokémon with its name and image', async () => {
    render(
      <MemoryRouter>
        <PokeGrid />
      </MemoryRouter>
    );

    // Espera a que se renderice el nombre del primer Pokémon
    const bulbasaurName = await screen.findByText(/bulbasaur/i);
    expect(bulbasaurName).toBeInTheDocument();

    // Verifica que se renderizaron las imágenes de ambos Pokémon
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png');
    expect(images[1]).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png');
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

  it('applies the correct CSS class for the grid layout', () => {
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    const gridContainer = screen.getByTestId('poke-grid-container');
    expect(gridContainer).toHaveClass('poke-grid-container');
  });
});
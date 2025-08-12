import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PokeGrid from '../pages/PokeGrid';
import PokemonCard from '../components/PokemonCard';
import { fireEvent, render, screen } from '@testing-library/react';

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
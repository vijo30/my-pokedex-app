import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokeGrid from '../pages/PokeGrid';
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
  it('should render a list of Pokémon after fetching from the API', async () => {
    render(
      <MemoryRouter>
        <PokeGrid />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    const pokemonName = await screen.findByText(/bulbasaur/i);
    expect(pokemonName).toBeInTheDocument();

    const pokemonCards = screen.getAllByRole('link', { name: /view details/i }); // Asumiendo que cada card es un link
    expect(pokemonCards).toHaveLength(3);
  });
});
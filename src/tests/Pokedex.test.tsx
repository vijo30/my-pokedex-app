import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Pokedex from '../pages/Pokedex';
import { vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});


const mockPokemonData = {
  name: 'bulbasaur',
  id: 1,
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
};

const mockSpeciesData = {
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
      language: { name: 'en' },
    },
    {
      flavor_text: 'Une étrange graine a été plantée sur son dos à la naissance. La plante pousse et grandit avec ce Pokémon.',
      language: { name: 'fr' },
    },
  ],
};


vi.stubGlobal('fetch', vi.fn((url) => {
  if (url.includes('pokemon-species')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockSpeciesData),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPokemonData),
  });
}));


describe('Pokedex', () => {
  it('should render a loading message initially and then display the pokemon details', async () => {
    render(
      <MemoryRouter initialEntries={['/pokedex/1']}>
        <Routes>
          <Route path="/pokedex/:id" element={<Pokedex />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    
    const pokemonName = screen.getByText(/bulbasaur/i);
    const pokemonId = screen.getByText(/Pokémon No: 1/i);
    const pokemonDescription = screen.getByText(/description: A strange seed was planted/i);
    
    expect(pokemonName).toBeInTheDocument();
    expect(pokemonId).toBeInTheDocument();
    expect(pokemonDescription).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /bulbasaur sprite/i })).toBeInTheDocument();
  });
});
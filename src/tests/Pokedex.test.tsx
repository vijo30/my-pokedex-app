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

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockPokemonData),
  })
));

describe('Pokedex', () => {
  it('should render a loading message initially', () => {
    render(
      <MemoryRouter initialEntries={['/pokedex/1']}>
        <Routes>
          <Route path="/pokedex/:id" element={<Pokedex />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });


  it('should fetch and display the pokemon details', async () => {
    render(
      <MemoryRouter initialEntries={['/pokedex/1']}>
        <Routes>
          <Route path="/pokedex/:id" element={<Pokedex />} />
        </Routes>
      </MemoryRouter>
    );


    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    

    const pokemonName = screen.getByText(/bulbasaur/i);
    const pokemonId = screen.getByText(/#1/i);
    const pokemonHeight = screen.getByText(/height: 0.7 m/i);
    const pokemonWeight = screen.getByText(/weight: 6.9 kg/i);
    const pokemonImage = screen.getByRole('img', { name: /bulbasaur sprite/i });
    
    expect(pokemonName).toBeInTheDocument();
    expect(pokemonId).toBeInTheDocument();
    expect(pokemonHeight).toBeInTheDocument();
    expect(pokemonWeight).toBeInTheDocument();
    expect(pokemonImage).toBeInTheDocument();
  });
});
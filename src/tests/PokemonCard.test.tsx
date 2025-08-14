import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
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
  it('navigates to the Pokedex details page on click', async () => {
    const mockPokemon = { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' };

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route 
            path="/" 
            element={<PokemonCard pokemon={mockPokemon} onToggleFavorite={() => { } } isFavorite={false} currentPage={1} />} 
          />
          <Route path="/pokedex/:id" element={<div>Pokemon Details Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const cardLink = screen.getByRole('link');
    
    fireEvent.click(cardLink);

    const detailsPage = await screen.findByText(/Poke/i);
    expect(detailsPage).toBeInTheDocument();
  });
});
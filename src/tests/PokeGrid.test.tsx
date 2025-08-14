import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import PokeGrid from '../pages/PokeGrid';

const mockInitialPage = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
  next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
};

const mockNextPage = {
  results: [
    { name: 'nidoqueen', url: 'https://pokeapi.co/api/v2/pokemon/31/' },
    { name: 'nidoran-m', url: 'https://pokeapi.co/api/v2/pokemon/32/' },
  ],
  previous: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=2',
};

const mockBulbasaur = { name: 'bulbasaur', sprites: { front_default: 'bulbasaur.png' } };
const mockIvysaur = { name: 'ivysaur', sprites: { front_default: 'ivysaur.png' } };
const mockNidoqueen = { name: 'nidoqueen', sprites: { front_default: 'nidoqueen.png' } };
const mockNidoran = { name: 'nidoran-m', sprites: { front_default: 'nidoran.png' } };

const LocationChecker = () => {
    const location = useLocation();
    return <span data-testid="location-display">{location.pathname}</span>;
};

describe('PokeGrid', () => {
  const setupLocalStorageMock = () => {
    const localStorageMock = {
      store: {} as { [key: string]: string },
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      clear() {
        this.store = {};
      },
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    return localStorageMock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a card for each Pokémon with its name and image', async () => {
    setupLocalStorageMock();
    global.fetch = vi.fn()
        .mockResolvedValueOnce(new Response(JSON.stringify(mockInitialPage), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockBulbasaur), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockIvysaur), { status: 200 }));
    
    render(<MemoryRouter><PokeGrid /></MemoryRouter>);

    await screen.findByText(/bulbasaur/i);
    await screen.findByText(/ivysaur/i);
    
    const pokemonImages = screen.getAllByRole('img');
    expect(pokemonImages.length).toBe(2);
    expect(pokemonImages[0]).toHaveAttribute('alt', 'bulbasaur');
    

  });


  it('should display pagination buttons and fetch the next page', async () => {
      setupLocalStorageMock();
      global.fetch = vi.fn()
          .mockResolvedValueOnce(new Response(JSON.stringify(mockInitialPage), { status: 200 }))
          .mockResolvedValueOnce(new Response(JSON.stringify(mockBulbasaur), { status: 200 }))
          .mockResolvedValueOnce(new Response(JSON.stringify(mockIvysaur), { status: 200 }))
          .mockResolvedValueOnce(new Response(JSON.stringify(mockNextPage), { status: 200 }))
          .mockResolvedValueOnce(new Response(JSON.stringify(mockNidoqueen), { status: 200 }))
          .mockResolvedValueOnce(new Response(JSON.stringify(mockNidoran), { status: 200 }));

      render(
        <MemoryRouter initialEntries={['/pokegrid/1']}>
          <PokeGrid />
          <LocationChecker />
        </MemoryRouter>
      );

      await screen.findByText(/bulbasaur/i);
      const nextButton = screen.getByRole('button', { name: /Next/i });
      expect(nextButton).toBeInTheDocument();


      fireEvent.click(nextButton);

      await waitFor(() => {
          expect(screen.getByTestId('location-display').textContent).toBe('/pokegrid/2');
      });
    });

  it('should filter the list of pokemon based on search input', async () => {
    setupLocalStorageMock();
    global.fetch = vi.fn()
        .mockResolvedValueOnce(new Response(JSON.stringify(mockInitialPage), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockBulbasaur), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockIvysaur), { status: 200 }));

    render(<MemoryRouter><PokeGrid /></MemoryRouter>);
    
    await screen.findByText(/bulbasaur/i);
    await screen.findByText(/ivysaur/i);
    
    const searchInput = screen.getByPlaceholderText(/Filter.../i);
    
    fireEvent.change(searchInput, { target: { value: 'ivy' } });
    
    await waitFor(() => {
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    });
  });

  it('should allow marking a pokemon as favorite and filtering by it', async () => {
    setupLocalStorageMock();
    global.fetch = vi.fn()
        .mockResolvedValueOnce(new Response(JSON.stringify(mockInitialPage), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockBulbasaur), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockIvysaur), { status: 200 }));

    render(<MemoryRouter initialEntries={['/pokegrid/1']}><PokeGrid /></MemoryRouter>);
    
    await screen.findByText(/bulbasaur/i);
    await screen.findByText(/ivysaur/i);

    const favoriteButtons = screen.getAllByLabelText(/Toggle favorite/i);
    fireEvent.click(favoriteButtons[0]);
    
    const filterButton = screen.getByRole('button', { name: /Show Only Favorites/i });
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.queryByText(/ivysaur/i)).toBeNull();
    });
  });
});
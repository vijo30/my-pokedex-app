import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { vi } from 'vitest';

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('LandingPage', () => {
  it('renders title, subtitle, and a start button', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const title = screen.getByText(/Pokedex App/i);
    const subtitle = screen.getByText(/Another front-end/i);
    const startButton = screen.getByRole('button', { name: /start/i });

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(startButton).toBeInTheDocument();
  });

  it('navigates to PokeGrid on start button click', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/pokegrid');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { fromGrid: true, page: 2 },
    }),
  };
});

describe('BackButton', () => {
  it('should render with the default text "Go Back"', () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    );
    const buttonElement = screen.getByRole('button', { name: /Go Back/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('back-button');
  });

  it('should navigate to the correct page based on state', () => {
      render(
        <MemoryRouter initialEntries={['/pokedex/1']}>
          <BackButton />
        </MemoryRouter>
      );

      const buttonElement = screen.getByRole('button', { name: /Go Back/i });
      fireEvent.click(buttonElement);
      
      expect(mockNavigate).toHaveBeenCalledWith('/pokegrid/2');
  });


  it('should render with custom children text', () => {
    render(
      <BrowserRouter>
        <BackButton>Return</BackButton>
      </BrowserRouter>
    );
    const buttonElement = screen.getByRole('button', { name: /Return/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
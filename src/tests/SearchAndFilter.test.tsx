import { render, screen, fireEvent } from '@testing-library/react';
import SearchAndFilter from '../components/SearchAndFilter';
import { vi } from 'vitest';

describe('SearchAndFilter', () => {
  it('should call the onSearch function when the input value changes', () => {
    const onSearchMock = vi.fn();

    render(<SearchAndFilter onSearch={onSearchMock} onToggleFavorites={() => {}} filterFavorites={false} />);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'bulba' } });

    expect(onSearchMock).toHaveBeenCalledWith('bulba');
  });

  it('should call onToggleFavorites when the filter button is clicked', () => {
    const onToggleMock = vi.fn();

    render(<SearchAndFilter onSearch={() => {}} onToggleFavorites={onToggleMock} filterFavorites={false} />);

    const filterButton = screen.getByRole('button', { name: /favoritos/i });
    fireEvent.click(filterButton);

    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });
});
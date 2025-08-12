import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination';
import { vi } from 'vitest';

describe('Pagination', () => {
  it('should call the correct function when previous and next buttons are clicked', () => {
    const onPreviousMock = vi.fn();
    const onNextMock = vi.fn();

    render(<Pagination hasPrevious={true} hasNext={true} onPrevious={onPreviousMock} onNext={onNextMock} />);

    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(onPreviousMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });

  it('should disable the previous button on the first page', () => {
    const onPreviousMock = vi.fn();
    const onNextMock = vi.fn();

    render(<Pagination hasPrevious={false} hasNext={true} onPrevious={onPreviousMock} onNext={onNextMock} />);

    const previousButton = screen.getByRole('button', { name: /anterior/i });
    expect(previousButton).toBeDisabled();
  });
});
import React from 'react';
import Button from './Button';
import '../styles/Pagination.css';

interface PaginationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <div className="pagination-container">
      {hasPrevious && <Button onClick={onPrevious}>Previous</Button>}
      {hasNext && <Button onClick={onNext}>Next</Button>}
    </div>
  );
};

export default Pagination;
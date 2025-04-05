import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 3;

  const getVisiblePages = () => {
    const pages: number[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages.filter(p => p >= 1 && p <= totalPages);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination flex gap-2 items-center justify-center mt-4">
      <button onClick={handleFirstPage} disabled={currentPage === 1} className="px-2 py-1">&laquo;</button>
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-2 py-1">&lsaquo;</button>

      {getVisiblePages().map((page) => {
        const isActive = page === currentPage;

        const isFixedActive =
          (page === 1 && currentPage === 1) ||
          (page === totalPages && currentPage === totalPages);

        const baseClass = "px-3 py-1 rounded";

        const activeClass = isFixedActive
          ? "bg-blue-700 text-white font-bold border border-blue-300 shadow-md"
          : isActive
          ? "bg-indigo-600 text-white font-bold"
          : "bg-gray-200 hover:bg-gray-300";

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${baseClass} ${activeClass}`}
          >
            {page}
          </button>
        );
      })}

      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1">&rsaquo;</button>
      <button onClick={handleLastPage} disabled={currentPage === totalPages} className="px-2 py-1">&raquo;</button>
    </div>
  );
};

export default Pagination;
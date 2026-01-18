import React from "react";

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 15,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <p className="text-xs text-gray-500 font-medium italic">
        Showing {startItem}-{endItem} of {totalItems} items
      </p>
      <div className="flex gap-1">
        <button
          onClick={() =>
            onPageChange && onPageChange(Math.max(1, currentPage - 1))
          }
          disabled={currentPage === 1}
          className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">
            chevron_left
          </span>
        </button>

        {/* Simple pagination logic - can be expanded for many pages */}
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange && onPageChange(page)}
            className={`size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-xs font-bold ${
              currentPage === page
                ? "bg-white dark:bg-gray-800 text-primary"
                : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))
          }
          className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined text-lg">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

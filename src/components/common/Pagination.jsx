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
    <div className="px-6 py-4 bg-white dark:bg-gray-900 flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Showing{" "}
        <span className="text-gray-900 dark:text-white">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="text-gray-900 dark:text-white">{totalItems}</span>{" "}
        items
      </p>
      <div className="flex gap-2">
        <button
          onClick={() =>
            onPageChange && onPageChange(Math.max(1, currentPage - 1))
          }
          disabled={currentPage === 1}
          className="size-8 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">
            chevron_left
          </span>
        </button>

        {totalPages > 0 &&
          Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => onPageChange && onPageChange(page)}
                className={`size-8 flex items-center justify-center rounded-lg border text-[10px] font-bold transition-all shadow-sm ${
                  currentPage === page
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary hover:border-primary/30"
                }`}
              >
                {page}
              </button>
            ),
          )}

        <button
          onClick={() =>
            onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="size-8 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
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

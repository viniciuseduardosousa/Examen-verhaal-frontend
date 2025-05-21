import React from 'react';

const AdminPagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center gap-2 mt-2 pt-4 border-t">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded font-mono transition-all font-bold ${
              currentPage === page
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default AdminPagination; 
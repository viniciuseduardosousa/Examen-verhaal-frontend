import React from 'react';
import { motion } from 'framer-motion';

const AdminSearchBar = ({ searchTerm, setSearchTerm, showSearch, setShowSearch }) => {
  return (
    <div className="relative w-full max-w-md h-10 flex items-center">
      <div className="flex items-center w-full justify-end">
        <motion.div
          key="searchbar"
          initial={false}
          animate={{ width: showSearch ? '100%' : 0, opacity: showSearch ? 1 : 0 }}
          transition={{ width: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
          onAnimationComplete={() => {
            if (showSearch) {
              const searchInput = document.querySelector('input[type="text"]');
              if (searchInput) {
                searchInput.focus();
              }
            }
          }}
          className="flex items-center bg-[#F5F5F5] rounded-full shadow-inner px-4 h-10 absolute right-0 w-full z-10"
          style={{ overflow: 'hidden' }}
        >
          <input
            type="text"
            placeholder="Zoeken ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent flex-1 outline-none font-mono text-base"
            autoFocus={showSearch}
            style={{ minWidth: 0 }}
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setShowSearch(false);
            }}
            className="ml-2 text-black hover:text-gray-700"
            title="Zoekbalk sluiten"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
        <motion.button
          key="searchbutton"
          initial={false}
          animate={{ opacity: showSearch ? 0 : 1, width: showSearch ? 0 : 40 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowSearch(true)}
          className="w-10 h-10 bg-[#F5F5F5] rounded-full shadow-inner hover:bg-gray-200 transition flex items-center justify-center absolute right-0 z-20"
          style={{ pointerEvents: showSearch ? 'none' : 'auto' }}
          aria-label="Zoeken"
        >
          <svg className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default AdminSearchBar; 
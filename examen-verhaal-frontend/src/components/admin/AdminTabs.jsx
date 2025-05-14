import React from 'react';
import { motion } from 'framer-motion';

const AdminTabs = ({ showCategories, setShowCategories }) => {
  return (
    <div className="flex bg-[#F5F5F5] rounded-full shadow-inner h-10 w-full max-w-sm relative">
      <motion.div
        className="absolute bg-white rounded-full shadow"
        initial={false}
        animate={{
          x: showCategories ? '100%' : '0%',
          width: '50%',
          height: '100%',
          top: '0',
          left: '0'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        onClick={() => setShowCategories(false)}
        className={`w-1/2 flex justify-center items-center px-3 h-10 text-base font-mono rounded-full transition-all font-bold relative z-10 ${
          !showCategories
            ? "text-blue-600"
            : "text-gray-500 font-normal"
        }`}
      >
        Verhalen
      </button>
      <button
        onClick={() => setShowCategories(true)}
        className={`w-1/2 flex justify-center items-center px-3 h-10 text-base font-mono rounded-full transition-all font-bold relative z-10 ${
          showCategories
            ? "text-blue-600"
            : "text-gray-500 font-normal"
        }`}
      >
        Categorieën
      </button>
    </div>
  );
};

export default AdminTabs; 
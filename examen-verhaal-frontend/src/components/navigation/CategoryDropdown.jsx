import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'UKV Columns', path: '/categorie/ukv-columns' },
  { name: 'Korte Verhalen', path: '/categorie/korte-verhalen' },
  { name: '50 Words Stories', path: '/categorie/50-words-stories' },
  { name: 'Sound Stories', path: '/categorie/sound-stories' },
];

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sluit dropdown wanneer er buiten wordt geklikt
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-xl text-gray-800 relative group flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Categorieën</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border-2 border-gray-800">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)} // Sluit dropdown na selectie
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown; 
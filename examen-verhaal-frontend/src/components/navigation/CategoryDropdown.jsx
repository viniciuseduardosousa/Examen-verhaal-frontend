import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { verhalenAPI } from '../../services/api';
import { adminCategoriesAPI } from '../../services/adminApi';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch both stories and categories
        const [storiesData, categoriesData] = await Promise.all([
          verhalenAPI.getAll(),
          adminCategoriesAPI.getAll()
        ]);

        // Create a map of category IDs to names
        const categoryIdToName = {};
        categoriesData.forEach(category => {
          categoryIdToName[category.id] = category.naam;
        });

        // Get unique category IDs from stories
        const uniqueCategoryIds = [...new Set(storiesData.map(verhaal => verhaal.categorie))].filter(Boolean);
        
        // Create category objects with count
        const categoriesWithCount = uniqueCategoryIds.map(id => ({
          id: id,
          name: categoryIdToName[id],
          path: `/verhalen?category=${encodeURIComponent(categoryIdToName[id])}`,
          count: storiesData.filter(verhaal => verhaal.categorie === id).length
        })).filter(category => category.name); // Filter out any categories without names

        setCategories(categoriesWithCount);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de categorieën.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="text-xl text-gray-800 relative group flex items-center gap-2">
        <span>Categorieën</span>
        <svg
          className="w-4 h-4"
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xl text-gray-800 relative group flex items-center gap-2">
        <span>Categorieën</span>
        <svg
          className="w-4 h-4"
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
      </div>
    );
  }

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
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border-2 border-gray-800">
          {loading ? (
            <div className="px-4 py-2 text-gray-600">Laden...</div>
          ) : error ? (
            <div className="px-4 py-2 text-red-500">{error}</div>
          ) : categories.length === 0 ? (
            <div className="px-4 py-2 text-gray-600">Geen categorieën beschikbaar</div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown; 
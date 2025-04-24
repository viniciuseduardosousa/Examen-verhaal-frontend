import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { storiesAPI } from '../../services/api';

const MobileMenu = ({ isOpen, onClose }) => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const stories = await storiesAPI.getAll();
        // Extract unique categories from stories
        const uniqueCategories = [...new Set(stories.map(story => story.categorie.naam))];
        // Create category objects with count
        const categoriesWithCount = uniqueCategories.map(category => ({
          id: category,
          name: category,
          path: `/verhalen?category=${encodeURIComponent(category)}`,
          count: stories.filter(story => story.categorie.naam === category).length
        }));
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

  // Lock/unlock scroll when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#FFFFF5] z-50 animate-fadeIn overflow-y-auto">
      <div className="flex flex-col h-full p-8">
        {/* Header with Logo and Close */}
        <div className="flex justify-between items-center mb-12">
          <span className="text-3xl font-medium tracking-tight">Ingscribblings</span>
          <button
            onClick={onClose}
            className="text-gray-800 hover:rotate-90 transition-all duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <input
            type="text"
            placeholder="Zoeken..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 bg-transparent border-b-2 border-gray-800 
                     focus:outline-none text-xl transition-all duration-300
                     focus:border-gray-600 placeholder-gray-500"
          />
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500
                      group-focus-within:text-gray-800 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-6">
          <Link 
            to="/verhalen" 
            className="text-2xl py-4 border-b-2 border-gray-800 hover:pl-4 
                     transition-all duration-300 hover:text-gray-600"
            onClick={onClose}
          >
            Verhalen
          </Link>
          <Link 
            to="/over-mij" 
            className="text-2xl py-4 border-b-2 border-gray-800 hover:pl-4 
                     transition-all duration-300 hover:text-gray-600"
            onClick={onClose}
          >
            Over-mij
          </Link>
          
          {/* Categories Dropdown */}
          <div className="border-b-2 border-gray-800">
            <button 
              className="w-full flex items-center justify-between text-2xl py-4
                       hover:pl-4 transition-all duration-300 hover:text-gray-600"
              onClick={() => setIsGenreOpen(!isGenreOpen)}
            >
              Categorieën
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  isGenreOpen ? 'rotate-180' : ''
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
            </button>
            
            {/* Category Items */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                isGenreOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="py-4 space-y-6">
                {loading ? (
                  <div className="text-xl pl-4">Laden...</div>
                ) : error ? (
                  <div className="text-xl pl-4 text-red-500">{error}</div>
                ) : (
                  categories.map((category) => (
                    <Link 
                      key={category.id}
                      to={category.path}
                      className="block text-xl pl-4 hover:pl-8 transition-all duration-300
                               hover:text-gray-600 flex justify-between items-center"
                      onClick={onClose}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu; 
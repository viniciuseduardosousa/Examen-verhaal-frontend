import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import StoryCard from '../components/cards/StoryCard';
import NoCoverStoryCard from '../components/cards/NoCoverStoryCard';
import Divider from '../components/decorative/Divider';
import { verhalenAPI, categoriesAPI } from '../services/api';
import Loader from '../components/Loader';

const Verhalen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both stories and categories
        const [storiesData, categoriesData] = await Promise.all([
          verhalenAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        // Create a map of category IDs to names
        const categoryIdToName = {};
        categoriesData.forEach(category => {
          categoryIdToName[category.id] = category.naam;
        });

        setStories(storiesData);
        setCategoryMap(categoryIdToName);
        
        // Get unique category names from the stories
        const uniqueCategoryIds = [...new Set(storiesData.map(verhaal => verhaal.categorie))].filter(Boolean);
        const uniqueCategoryNames = uniqueCategoryIds.map(id => categoryIdToName[id]).filter(Boolean);
        
        setCategories(uniqueCategoryNames);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de gegevens.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoriesFromUrl = categoryParam.split(',');
      setSelectedCategories(categoriesFromUrl);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      const newCategories = selectedCategories.filter(c => c !== category);
      setSelectedCategories(newCategories);
      navigate(newCategories.length > 0 ? `/verhalen?category=${encodeURIComponent(newCategories.join(','))}` : '/verhalen');
    } else {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      navigate(`/verhalen?category=${encodeURIComponent(newCategories.join(','))}`);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    navigate('/verhalen');
  };

  // Filter stories for the grid
  const filteredStories = stories
    .filter(story => {
      if (selectedCategories.length === 0) return true;
      const categoryName = categoryMap[story.categorie];
      return selectedCategories.includes(categoryName);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-new':
          return new Date(b.datum) - new Date(a.datum);
        case 'date-old':
          return new Date(a.datum) - new Date(b.datum);
        case 'az':
          return a.titel.localeCompare(b.titel);
        case 'za':
          return b.titel.localeCompare(a.titel);
        default:
          return 0;
      }
    });

  // Get stories for "Andere categorieën" section
  const otherCategoriesStories = stories.slice(0, 3);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader size="large" className="mb-4" />
          <p className="text-gray-600">Verhalen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 animate-fadeIn">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
        {/* Filter Icon and Categories */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category, index) => (
              <button 
                key={`${category}-${index}`}
                onClick={() => toggleCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 ${
                  selectedCategories.includes(category) ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <span className="text-sm sm:text-base">{category}</span>
                {selectedCategories.includes(category) && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters & Sort */}
        <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
          {selectedCategories.length >= 3 && (
            <button 
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm sm:text-base"
            >
              <span>Wis filters</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base w-full sm:w-auto appearance-none bg-white pr-8 cursor-pointer"
            >
              <option value="">Sorteren op</option>
              <option value="date-new">Datum (nieuwste eerst)</option>
              <option value="date-old">Datum (oudste eerst)</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
            <div className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
        {filteredStories.length > 0 ? (
          filteredStories.map((story, index) => {
            const hasCoverImage = Boolean(story.cover_image);
            
            return (
              <div 
                key={story.id}
                className="animate-slideDown"
                style={{ animationDelay: `${(index % 3) * 0.1}s` }}
              >
                {hasCoverImage ? (
                  <StoryCard
                    id={story.id}
                    title={story.titel}
                    description={story.beschrijving}
                    imageUrl={story.cover_image}
                    category={categoryMap[story.categorie]}
                  />
                ) : (
                  <NoCoverStoryCard
                    id={story.id}
                    title={story.titel}
                    description={story.beschrijving}
                    category={categoryMap[story.categorie]}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">Geen verhalen beschikbaar voor deze categorie</p>
            <button 
              onClick={clearAllFilters}
              className="mt-4 text-gray-800 hover:text-gray-600 underline"
            >
              Verwijder filters
            </button>
          </div>
        )}
      </div>
      
      {/* Andere categorieën sectie */}
      <Divider />
      <div className="mt-16">
        <h2 className="text-xl font-medium mb-8 flex items-center">
          Andere categorieën
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherCategoriesStories.map((story, index) => {
            const hasCoverImage = Boolean(story.cover_image);
            
            return (
              <div 
                key={story.id}
                className="animate-slideDown"
                style={{ animationDelay: `${(index % 3) * 0.1}s` }}
              >
                {hasCoverImage ? (
                  <StoryCard
                    id={story.id}
                    title={story.titel}
                    description={story.beschrijving}
                    imageUrl={story.cover_image}
                    category={categoryMap[story.categorie]}
                  />
                ) : (
                  <NoCoverStoryCard
                    id={story.id}
                    title={story.titel}
                    description={story.beschrijving}
                    category={categoryMap[story.categorie]}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Verhalen; 
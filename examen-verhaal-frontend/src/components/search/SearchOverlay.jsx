import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verhalenAPI, categoriesAPI } from '../../services/api';
import StoryCard from '../cards/StoryCard';

const SearchOverlay = ({ show, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Fetch stories and categories when overlay opens
  useEffect(() => {
    if (show) {
      setLoading(true);
      Promise.all([
        verhalenAPI.getAll(),
        categoriesAPI.getAll()
      ])
        .then(([storiesData, categoriesData]) => {
          setAllStories(storiesData);
          // Build categoryMap (id → name)
          const categoryIdToName = {};
          categoriesData.forEach(category => {
            categoryIdToName[category.id] = category.naam;
          });
          setCategoryMap(categoryIdToName);
          setError(null);
          setResults(storiesData);
        })
        .catch(err => {
          setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
          setAllStories([]);
          setCategoryMap({});
        })
        .finally(() => setLoading(false));
      document.body.style.overflow = 'hidden';
      if (inputRef.current) inputRef.current.focus();
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setResults([]);
      setPredictions([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  // Filter stories on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(allStories);
      setPredictions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Filter results
    const filteredResults = allStories.filter(story =>
      (story.titel && story.titel.toLowerCase().includes(term)) ||
      (story.tekst && story.tekst.toLowerCase().includes(term))
    );
    setResults(filteredResults);

    // Generate predictions based on titles
    const titlePredictions = allStories
      .filter(story => 
        story.titel && 
        story.titel.toLowerCase().includes(term) && 
        story.titel.toLowerCase() !== term
      )
      .map(story => story.titel)
      .slice(0, 5); // Limit to 5 predictions
    setPredictions(titlePredictions);
  }, [searchTerm, allStories]);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);

  // Handle click on StoryCard
  const handleStoryClick = (id) => {
    onClose();
    navigate(`/verhaal-detail/${id}`);
  };

  // Handle click on category tag
  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    onClose();
    navigate(`/verhalen?category=${encodeURIComponent(category)}`);
  };

  // Handle prediction click
  const handlePredictionClick = (prediction) => {
    setSearchTerm(prediction);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Sluit zoekvenster"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div ref={overlayRef} className="w-full flex flex-col items-center px-4">
        {/* Search bar with predictions */}
        <div className="relative w-full max-w-md mb-4 z-10">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Verhaal zoeken..."
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg shadow bg-white/90"
          />
          {searchTerm ? (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setSearchTerm('')}
              tabIndex={-1}
              aria-label="Wis zoekopdracht"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
          )}
          {/* Predictions dropdown */}
          {predictions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
              {predictions.map((prediction, index) => (
                <button
                  key={index}
                  onClick={() => handlePredictionClick(prediction)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  {prediction}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="w-full max-w-4xl">
          <h2 className="text-left text-xl font-semibold mb-4 text-white drop-shadow">
            {searchTerm ? 'Zoekresultaten:' : 'Alle verhalen:'}
          </h2>
          {loading ? (
            <div className="text-center py-8 text-white">Laden...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.length > 0 ? (
                results.map(story => (
                  <div key={story.id} onClick={() => handleStoryClick(story.id)} className="cursor-pointer">
                    <StoryCard
                      id={story.id}
                      title={story.titel}
                      description={story.tekst}
                      imageUrl={story.cover_image}
                      category={categoryMap[story.categorie]}
                      onCategoryClick={handleCategoryClick}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-white">
                  <p className="text-lg">Geen resultaten gevonden</p>
                  <p className="text-sm mt-2">Probeer een andere zoekterm</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay; 
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verhalenAPI } from '../../services/api';
import StoryCard from '../cards/StoryCard';

const SearchOverlay = ({ show, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Fetch stories when overlay opens
  useEffect(() => {
    if (show) {
      setLoading(true);
      verhalenAPI.getAll()
        .then(data => {
          setAllStories(data);
          setError(null);
        })
        .catch(err => {
          setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
          setAllStories([]);
        })
        .finally(() => setLoading(false));
      document.body.style.overflow = 'hidden';
      if (inputRef.current) inputRef.current.focus();
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  // Filter stories on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    setResults(
      allStories.filter(story =>
        (story.titel && story.titel.toLowerCase().includes(term)) ||
        (story.beschrijving && story.beschrijving.toLowerCase().includes(term))
      )
    );
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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div ref={overlayRef} className="w-full flex flex-col items-center px-4">
        {/* Search bar */}
        <div className="relative w-full max-w-md mb-4">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Verhaal zoeken..."
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow bg-white/90"
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
        </div>
        {/* Results */}
        <div className="w-full max-w-4xl">
          <h2 className="text-left text-xl font-semibold mb-4 text-white drop-shadow">Resultaten:</h2>
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
                      description={story.beschrijving}
                      imageUrl={story.cover_image}
                      category={story.categorie?.naam}
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
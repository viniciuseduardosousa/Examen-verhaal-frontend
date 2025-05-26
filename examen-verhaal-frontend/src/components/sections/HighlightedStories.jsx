import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import StoryCard from '../cards/StoryCard';
import NoCoverStoryCard from '../cards/NoCoverStoryCard';
import ArrowIcon from '../icons/ArrowIcon';
import { verhalenAPI, categoriesAPI } from '../../services/api';
import Loader from '../Loader';

const HighlightedStories = ({ onStoriesLoaded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [verhalen, setVerhalen] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    navigate(`/verhalen?category=${encodeURIComponent(category)}`);
    // Scroll to top of page after navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
        setCategoryMap(categoryIdToName);

        // Filter for highlighted stories
        const highlightedStories = storiesData.filter(story => story.is_uitgelicht);
        setVerhalen(highlightedStories);
        onStoriesLoaded(highlightedStories.length > 0);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
        console.error('Error fetching verhalen:', err);
        onStoriesLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onStoriesLoaded]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-medium">Uitgelichte verhalen</h2>
          </div>
          <Loader size="large" className="py-8" />
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="py-16 text-red-500">{error}</div>;
  }

  if (verhalen.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        {/* Header met pijl */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Uitgelichte verhalen</h2>
        </div>

        {/* Grid met kaarten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verhalen.map((verhaal) => {
            const hasCoverImage = Boolean(verhaal.cover_image);
            
            return hasCoverImage ? (
              <StoryCard
                key={verhaal.id}
                id={verhaal.id}
                title={verhaal.titel}
                description={verhaal.beschrijving}
                imageUrl={verhaal.cover_image}
                category={categoryMap[verhaal.categorie]}
                onCategoryClick={handleCategoryClick}
              />
            ) : (
              <NoCoverStoryCard
                key={verhaal.id}
                id={verhaal.id}
                title={verhaal.titel}
                text={verhaal.tekst}
                category={categoryMap[verhaal.categorie]}
                onCategoryClick={handleCategoryClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightedStories; 
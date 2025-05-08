import { useState, useEffect } from 'react';
import StoryCard from '../cards/StoryCard';
import ArrowIcon from '../icons/ArrowIcon';
import { verhalenAPI } from '../../services/api';
import Loader from '../Loader';

const HighlightedStories = ({ onStoriesLoaded }) => {
  const [verhalen, setVerhalen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerhalen = async () => {
      try {
        const data = await verhalenAPI.getAll();
        // Filter for highlighted stories
        const highlightedStories = data.filter(story => story.is_uitgelicht);
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

    fetchVerhalen();
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
          {verhalen.map((verhaal) => (
            <StoryCard
              key={verhaal.id}
              id={verhaal.id}
              title={verhaal.titel}
              description={verhaal.beschrijving}
              imageUrl={verhaal.cover_image}
              category={verhaal.categorie.naam}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedStories; 
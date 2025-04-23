import { useState, useEffect } from 'react';
import StoryCard from '../cards/StoryCard';
import ArrowIcon from '../icons/ArrowIcon';
import { storiesAPI } from '../../services/api';

const HighlightedStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await storiesAPI.getAll();
        // Take the first 3 stories as highlighted
        setStories(data.slice(0, 3));
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return <div className="py-16">Laden...</div>;
  }

  if (error) {
    return <div className="py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        {/* Header met pijl */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Uitgelichte verhalen</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>

        {/* Grid met kaarten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.titel}
              description={story.beschrijving}
              imageUrl={story.cover_image}
              category={story.categorie.naam}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedStories; 
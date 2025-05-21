import { useState, useEffect } from 'react';
import StoryCard from '../cards/StoryCard';
import NoCoverStoryCard from '../cards/NoCoverStoryCard';
import { verhalenAPI } from '../../services/api';

const StoriesSection = () => {
  const [verhalen, setVerhalen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerhalen = async () => {
      try {
        const data = await verhalenAPI.getAll();
        setVerhalen(data);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
        console.error('Error fetching verhalen:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerhalen();
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
        <h2 className="text-2xl font-medium mb-12">Alle verhalen</h2>
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
                category={verhaal.categorie.naam}
              />
            ) : (
              <NoCoverStoryCard
                key={verhaal.id}
                id={verhaal.id}
                title={verhaal.titel}
                text={verhaal.tekst}
                category={verhaal.categorie.naam}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection; 
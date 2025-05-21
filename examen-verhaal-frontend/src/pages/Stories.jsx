import { useState, useEffect } from 'react';
import StoryCard from '../components/cards/StoryCard';
import { verhalenAPI, categoriesAPI } from '../services/api';
import Loader from '../components/Loader';

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesData, categoriesData] = await Promise.all([
          verhalenAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        setStories(storiesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filter</h2>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="mb-2">Categorieën</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-gray-800 p-2"
            >
              <option value="">Alle categorieën</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.naam}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Genre's</label>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="border-2 border-gray-800 p-2"
            >
              <option value="">Alle genres</option>
              <option value="Romantiek">Romantiek</option>
              <option value="Drama">Drama</option>
              <option value="Mysterie">Mysterie</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Datum</label>
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-2 border-gray-800 p-2"
            >
              <option value="">Alle datums</option>
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Verhalen</h1>
        
        {/* Category Title */}
        {selectedCategory && (
          <h2 className="text-2xl font-semibold mb-6">
            {categories.find(cat => cat.id === selectedCategory)?.naam || 'Verhalen'}
          </h2>
        )}
        
        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories
            .filter(story => !selectedCategory || story.categorie === selectedCategory)
            .sort((a, b) => {
              if (selectedDate === 'newest') {
                return new Date(b.datum) - new Date(a.datum);
              } else if (selectedDate === 'oldest') {
                return new Date(a.datum) - new Date(b.datum);
              }
              return 0;
            })
            .map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.titel}
                description={story.beschrijving}
                imageUrl={story.cover_image}
                category={categories.find(cat => cat.id === story.categorie)?.naam}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stories; 
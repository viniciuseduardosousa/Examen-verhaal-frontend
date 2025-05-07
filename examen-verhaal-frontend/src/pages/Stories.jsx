import { useState } from 'react';
import StoryCard from '../components/cards/StoryCard';
import { mockStories } from '../data/mockStories';

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState('Romantische verhalen');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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
              <option value="Romantische verhalen">Romantische verhalen</option>
              <option value="Korte verhalen">Korte verhalen</option>
              <option value="Spannende verhalen">Spannende verhalen</option>
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
        <h2 className="text-2xl font-semibold mb-6">{selectedCategory}</h2>
        
        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockStories.map((story) => (
            <StoryCard
              key={story.id}
              title={story.title}
              description={story.description}
              imageUrl={story.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories; 
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockStories } from '../data/mockStories';
import HighlightedStories from '../components/sections/HighlightedStories';
import Divider from '../components/decorative/Divider'; 

const VerhaalDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = () => {
      try {
        const foundStory = mockStories.find(story => story.id === parseInt(id));
        if (!foundStory) {
          throw new Error('Verhaal niet gevonden');
        }
        setStory(foundStory);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching story:', err);
      }
    };

    fetchStory();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!story) {
    return <div>Verhaal niet gevonden</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Header Section */}
      <section className="py-8 animate-fadeIn">  
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side - Image and Category */}
          <div className="w-64 h-64 md:w-80 md:h-80 relative group">
            <div className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                         group-hover:translate-x-1 group-hover:translate-y-1 
                         transition-transform duration-200"></div>
            <img 
              src={story.image || "https://placehold.co/600x400"} 
              alt={story.title}
              className="relative w-full h-full object-cover border-2 border-gray-800"
            />
          </div>

          {/* Right side - Title, Description and Buttons */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">{story.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-6">{story.description}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Bewerken
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Verwijderen
              </button>
            </div>
            <div className="mt-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {story.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Story Content Section */}
      <section className="py-8 animate-slideDown">
        <div className="prose prose-lg max-w-none">
          {story.content}
        </div>
      </section>

      <Divider />
      <HighlightedStories />
      <Divider />
    </div>
  );
};

export default VerhaalDetail; 
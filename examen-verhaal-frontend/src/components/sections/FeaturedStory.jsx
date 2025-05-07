import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';
import trainImage from '../../assets/images/train.webp';
import { verhalenAPI } from '../../services/api';

const FeaturedStory = ({ onStoryLoaded }) => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedStory = async () => {
      try {
        const stories = await verhalenAPI.getAll();
        console.log('All stories from API:', stories);
        
        // Filter spotlighted stories
        const spotlightedStories = stories.filter(story => story.is_spotlighted);
        console.log('Spotlighted stories:', spotlightedStories);
        
        // Sort by ID in descending order
        spotlightedStories.sort((a, b) => b.id - a.id);
        console.log('Sorted spotlighted stories:', spotlightedStories);
        
        // Take the first one (highest ID)
        const featuredStory = spotlightedStories[0];
        console.log('Selected featured story:', featuredStory);
        
        setStory(featuredStory || null);
        onStoryLoaded(!!featuredStory);
        setError(null);
      } catch (err) {
        console.error('Error in fetchFeaturedStory:', err);
        setError('Er is een fout opgetreden bij het ophalen van het uitgelichte verhaal.');
        onStoryLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    // Set loading state and notify parent
    setLoading(true);
    onStoryLoaded(false);

    // Fetch immediately
    fetchFeaturedStory();

    // Set up polling to refresh every 5 seconds
    const intervalId = setInterval(fetchFeaturedStory, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [onStoryLoaded]);

  const handleReadMore = () => {
    if (story) {
      navigate(`/verhaal-detail/${story.id}`);
    }
  };

  if (loading || error || !story) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        {/* Header met titel en pijl */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Uitgelicht verhaal</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>

        {/* Content container */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Linker kolom met grote afbeelding */}
          <div className="w-full md:w-1/2">
            <div className="w-full h-[500px] border-2 border-gray-800">
              <img 
                src={story.cover_image || trainImage} 
                alt={story.titel}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Rechter kolom met content */}
          <div className="w-full md:w-1/2 flex flex-col h-[500px]">
            <div className="flex-grow flex flex-col">
              <h2 className="text-3xl font-medium mb-4">{story.titel}</h2>
              <p className="text-gray-700 overflow-y-auto pr-4">{story.beschrijving}</p>
            </div>
            
            {/* Lees het hele verhaal button */}
            <button 
              onClick={handleReadMore}
              className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors mt-6"
            >
              <span>Lees het hele verhaal</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory; 
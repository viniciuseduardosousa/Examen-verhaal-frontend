import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';
import { verhalenAPI } from '../../services/api';
import Loader from '../Loader';
import RichTextDisplay from '../admin/RichTextDisplay';

const FeaturedStory = ({ onStoryLoaded }) => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedStory = async () => {
      try {
        const stories = await verhalenAPI.getAll();
        const spotlightedStories = stories.filter(story => story.is_spotlighted);
        spotlightedStories.sort((a, b) => b.id - a.id);
        const featuredStory = spotlightedStories[0];
        
        if (featuredStory) {
          setStory(featuredStory);
          onStoryLoaded(true);
        } else {
          setStory(null);
          onStoryLoaded(false);
        }
        setError(null);
      } catch (err) {
        console.error('Error in fetchFeaturedStory:', err);
        setError('Er is een fout opgetreden bij het ophalen van het uitgelichte verhaal.');
        setStory(null);
        onStoryLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStory();
  }, [onStoryLoaded]);

  const handleReadMore = () => {
    if (story) {
      navigate(`/verhaal-detail/${story.id}`);
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    
    // Clean up the text: remove extra spaces and normalize whitespace
    const cleanText = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .trim();               // Remove leading/trailing spaces
    
    if (cleanText.length <= maxLength) return cleanText;
    
    // Find the last space before maxLength to avoid cutting words in half
    const lastSpace = cleanText.slice(0, maxLength).lastIndexOf(' ');
    const truncateAt = lastSpace > 0 ? lastSpace : maxLength;
    
    return cleanText.slice(0, truncateAt) + '...';
  };

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-medium">Spotlighted verhaal</h2>
          </div>
          <Loader size="large" className="py-6" />
        </div>
      </section>
    );
  }

  if (error || !story) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        {/* Header met titel en pijl */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-medium">Spotlighted verhaal</h2>
        </div>

        {/* Content container */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Linker kolom met grote afbeelding */}
          {story.cover_image && (
            <div className="w-full md:w-1/2">
              <button 
                onClick={handleReadMore}
                className="w-full h-[350px] border-2 border-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img 
                  src={story.cover_image} 
                  alt={story.titel}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          )}
          
          {/* Rechter kolom met content */}
          <div className="w-full md:w-1/2 flex flex-col h-[350px]">
            <div className="flex-grow flex flex-col">
              <h2 className="text-3xl font-medium mb-4 break-words">{story.titel}</h2>
              <div className="overflow-hidden flex-grow pr-4">
                <div className="text-gray-700 text-base sm:text-lg break-words whitespace-normal leading-relaxed">
                  {story.tekst ? (
                    story.word_file ? (
                      <RichTextDisplay content={story.tekst} />
                    ) : (
                      <p>{truncateText(story.tekst)}</p>
                    )
                  ) : (
                    <p>{story.beschrijving}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Lees het hele verhaal button */}
            <button 
              onClick={handleReadMore}
              className="flex items-center justify-center gap-2 border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors mt-4"
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
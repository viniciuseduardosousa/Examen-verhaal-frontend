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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Afbeelding sectie */}
          <div className="w-full h-80 md:h-96 relative group">
            <div className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                         group-hover:translate-x-1 group-hover:translate-y-1 
                         transition-transform duration-200"></div>
            <img 
              src={story.image || "https://placehold.co/600x400"} 
              alt={story.title}
              className="relative w-full h-full object-cover border-2 border-gray-800"
            />
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {story.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {story.date || 'Geen datum beschikbaar'}
              </span>
            </div>
          </div>

          {/* Tekst sectie */}
          <div className="grid grid-rows-[auto_1fr_auto] h-full">
            {/* Titel en beschrijving */}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-800 leading-tight">{story.title}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-6 leading-relaxed font-serif">{story.description}</p>
            </div>

            {/* Actie knoppen */}
            <div className="flex flex-col justify-end gap-4">
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z"/>
                  </svg>
                  Deel
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                  </svg>
                  Download als PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Story Content Section */}
      <section className="py-8 animate-slideDown">
        <div className="prose prose-lg max-w-none font-serif leading-relaxed text-gray-700">
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
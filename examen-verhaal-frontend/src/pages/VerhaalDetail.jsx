import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockStories } from '../data/mockStories';

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
    <div>
      <h1>{story.title}</h1>
      <p>{story.content}</p>
      <p>woorden</p>
    </div>
  );
};

export default VerhaalDetail; 
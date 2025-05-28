import Hero from '../components/Hero';
import Divider from '../components/decorative/Divider';
import HighlightedStories from '../components/sections/HighlightedStories';
import Categories from '../components/sections/Categories';
import FeaturedStory from '../components/sections/FeaturedStory';
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/adminApi';

const Home = () => {
  const [hasFeaturedStory, setHasFeaturedStory] = useState(false);
  const [hasHighlightedStories, setHasHighlightedStories] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [subtitle, setSubtitle] = useState('Loading..');

  useEffect(() => {
    const fetchSubtitle = async () => {
      const data = await profileAPI.getOvermij();
      if (data.subtitel) setSubtitle(data.subtitel);
    };

    fetchSubtitle();
    window.addEventListener('profileDataUpdated', fetchSubtitle);
    return () => window.removeEventListener('profileDataUpdated', fetchSubtitle);
  }, []);

  return (
    <div className="min-h-screen">
      <Hero subtitle={subtitle} />
      <div className="pt-20">
        <Categories onCategoriesLoaded={(hasCategories) => setHasCategories(hasCategories)} />
      </div>
      <HighlightedStories onStoriesLoaded={(hasStories) => setHasHighlightedStories(hasStories)} />
      <FeaturedStory onStoryLoaded={(hasStory) => setHasFeaturedStory(hasStory)} />
      <div className="container mx-auto px-4 py-8">
      </div>
    </div>
  );
};

export default Home; 
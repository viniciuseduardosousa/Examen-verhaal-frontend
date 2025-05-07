import Hero from '../components/Hero';
import Divider from '../components/decorative/Divider';
import HighlightedStories from '../components/sections/HighlightedStories';
import Categories from '../components/sections/Categories';
import FeaturedStory from '../components/sections/FeaturedStory';
import { useState } from 'react';

const Home = () => {
  const [hasFeaturedStory, setHasFeaturedStory] = useState(false);

  return (
    <div className="min-h-screen">
      <Hero />
      <Divider />
      <HighlightedStories />
      <Divider />
      <Categories />
      {hasFeaturedStory && <Divider />}
      <FeaturedStory onStoryLoaded={(hasStory) => setHasFeaturedStory(hasStory)} />
      {hasFeaturedStory && <Divider />}
      <div className="container mx-auto px-4 py-8">
      </div>
    </div>
  );
};

export default Home; 
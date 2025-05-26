import Hero from '../components/Hero';
import Divider from '../components/decorative/Divider';
import HighlightedStories from '../components/sections/HighlightedStories';
import Categories from '../components/sections/Categories';
import FeaturedStory from '../components/sections/FeaturedStory';
import { useState } from 'react';

const Home = () => {
  const [hasFeaturedStory, setHasFeaturedStory] = useState(false);
  const [hasHighlightedStories, setHasHighlightedStories] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);

  return (
    <div className="min-h-screen">
      {/* <Hero /> */}
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
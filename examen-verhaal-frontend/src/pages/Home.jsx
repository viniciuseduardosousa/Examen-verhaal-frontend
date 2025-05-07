import Hero from '../components/Hero';
import Divider from '../components/decorative/Divider';
import HighlightedStories from '../components/sections/HighlightedStories';
import Categories from '../components/sections/Categories';
import FeaturedStory from '../components/sections/FeaturedStory';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Divider />
      <HighlightedStories />
      <Divider />
      <Categories />
      <Divider />
      <FeaturedStory />
      <Divider />
      <div className="container mx-auto px-4 py-8">
      </div>
    </div>
  );
};

export default Home; 
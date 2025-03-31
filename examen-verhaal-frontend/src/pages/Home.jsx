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
      <FeaturedStory 
        title="De Verloren Brief"
        description="Een meeslepend verhaal over een brief die vijftig jaar te laat werd bezorgd. Het onthult een vergeten liefdesverhaal en verbindt twee generaties door een toevallige ontdekking. De brief, vergeeld door de tijd maar perfect bewaard, brengt lang bewaarde geheimen aan het licht en zet een reeks gebeurtenissen in gang die niemand had kunnen voorzien. Een verhaal over tijd, herinneringen en de onverwachte manieren waarop het verleden ons heden kan vormgeven."
        imageUrl="/path/to/image.jpg"
      />
      <Divider />
      <div className="container mx-auto px-4 py-8">
        {/* Voeg hier je content toe */}
      </div>
    </div>
  );
};

export default Home; 
import StoryCard from '../cards/StoryCard';
import ArrowIcon from '../icons/ArrowIcon';

const HighlightedStories = () => {
  // Dit zou later uit een API of CMS kunnen komen
  const stories = [
    {
      id: 1,
      title: "De Verloren Brief",
      description: "Een verhaal over een brief die 50 jaar te laat werd bezorgd. Een verhaal over tijd, herinneringen en onverwachte verbindingen.",
      imageUrl: "",
      category: "Columns"
    },
    {
      id: 2,
      title: "Laatste Trein",
      description: "Een mysterieuze ontmoeting in de laatste trein van de avond leidt tot een onverwachte wending in het leven van een forens.",
      imageUrl: "",
      category: "50Words"
    },
    {
      id: 3,
      title: "De Componist",
      description: "Het leven van een componist die alleen in stilte kan werken wordt op zijn kop gezet door een onverwachte nieuwe buur.",
      imageUrl: "",
      category: "SoundStories"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        {/* Header met pijl */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Uitgelichte verhalen</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>

        {/* Grid met kaarten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <StoryCard key={index} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedStories; 
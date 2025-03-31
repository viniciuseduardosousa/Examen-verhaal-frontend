import CategoryCard from '../cards/CategoryCard';
import ArrowIcon from '../icons/ArrowIcon';

const Categories = () => {
  const categories = [
    {
      title: "Korte Verhalen",
      description: "Ontdek onze collectie korte verhalen, perfect voor een moment van ontspanning.",
      imageUrl: "/category1.jpg"
    },
    {
      title: "50 Words Stories",
      description: "Krachtige verhalen verteld in precies vijftig woorden.",
      imageUrl: "/category2.jpg"
    },
    {
      title: "Sound Stories",
      description: "Verhalen die tot leven komen door geluid en muziek.",
      imageUrl: ""
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Categorieën</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 
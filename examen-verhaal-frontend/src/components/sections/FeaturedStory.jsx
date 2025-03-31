import ArrowIcon from '../icons/ArrowIcon';
import trainImage from '../../assets/images/train.webp';

const FeaturedStory = ({ title, description, imageUrl }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        {/* Header met titel en pijl */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Uitgelicht verhaal</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>

        {/* Content container */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Linker kolom met grote afbeelding */}
          <div className="w-full md:w-1/2">
            <div className="w-full h-[500px] border-2 border-gray-800">
              <img 
                src={imageUrl || trainImage} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Rechter kolom met content */}
          <div className="w-full md:w-1/2 flex flex-col h-[500px]">
            <div className="flex-grow flex flex-col">
              <h2 className="text-3xl font-medium mb-4">{title}</h2>
              <p className="text-gray-700 overflow-y-auto pr-4">{description}</p>
            </div>
            
            {/* Lees het hele verhaal button */}
            <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors mt-6">
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
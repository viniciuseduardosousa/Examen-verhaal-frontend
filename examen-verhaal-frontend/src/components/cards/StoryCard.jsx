import ArrowIcon from '../icons/ArrowIcon';
import trainImage from '../../assets/images/train.webp';

const StoryCard = ({ title, description, imageUrl, category }) => {
  return (
    <div className="flex flex-col border-2 border-gray-800 bg-white w-full">
      {/* Image container met vaste hoogte */}
      <div className="p-3 sm:p-4">
        <div className="relative w-full h-[160px] sm:h-[200px]">
          <img 
            src={imageUrl || trainImage} 
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-mono text-base sm:text-lg">{title}</h3>
            {category && (
              <span className="px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs sm:text-sm whitespace-nowrap ml-2">
                {category}
              </span>
            )}
          </div>
          <p className="text-gray-700 text-xs sm:text-sm line-clamp-3">{description}</p>
        </div>
        
        {/* Lees meer button */}
        <div className="mt-auto">
          <button className="w-full border-2 border-gray-800 py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
            <span>Lees meer</span>
            <ArrowIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard; 
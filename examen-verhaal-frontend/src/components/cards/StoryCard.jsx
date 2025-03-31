import ArrowIcon from '../icons/ArrowIcon';
import trainImage from '../../assets/images/train.webp';

const StoryCard = ({ title, description, imageUrl }) => {
  return (
    <div className="flex flex-col">
      {/* Image container met vaste hoogte */}
      <div className="w-full h-[280px] border-2 border-gray-800 mb-4">
        <img 
          src={imageUrl || trainImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
        
        {/* Lees meer button */}
        <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors">
          <span>Lees meer</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StoryCard; 
import { Link } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';
import trainImage from '../../assets/images/train.webp';

const CategoryCard = ({ title, description, imageUrl, category }) => {
  return (
    <Link 
      to={`/verhalen?category=${encodeURIComponent(category)}`}
      className="block"
    >
      <div className="flex flex-col border-2 border-gray-800 bg-white p-4">
        {/* Image container met overlay */}
        <div className="relative w-full h-[280px] mb-6">
          <img 
            src={imageUrl || trainImage} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay voor leesbaarheid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            <p className="line-clamp-3">{description}</p>
          </div>
        </div>
        
        {/* Button onder de afbeelding */}
        <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors">
          <span>Bekijk verhalen</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};

export default CategoryCard; 
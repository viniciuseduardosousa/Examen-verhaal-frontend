import { Link } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';

const NoCoverCategoryCard = ({ title, description, category }) => {
  return (
    <Link 
      to={`/verhalen?category=${encodeURIComponent(category)}`}
      className="block"
    >
      <div className="flex flex-col border-2 border-gray-800 bg-white p-4 h-[360px]">
        {/* Content container met vaste hoogte */}
        <div className="h-[280px] mb-6">
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{description}</p>
        </div>
        
        {/* Button onder de content */}
        <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors">
          <span>Bekijk verhalen</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};

export default NoCoverCategoryCard; 
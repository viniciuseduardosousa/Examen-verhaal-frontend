import { Link } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';

const NoCoverCategoryCard = ({ title, description, category }) => {
  return (
    <Link 
      to={`/verhalen?category=${encodeURIComponent(category)}`}
      className="block group"
    >
      <div className="flex flex-col border-2 border-gray-800 bg-white p-4">
        {/* Placeholder container met dezelfde hoogte als de image container */}
        <div className="relative w-full h-[280px] mb-6 bg-[#F7F6ED]">
          {/* Decorative background pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            opacity: 0.1
          }} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-medium mb-2 text-white">{title}</h3>
            {description && (
              <p className="text-gray-200 line-clamp-3">{description}</p>
            )}
          </div>
        </div>
        
        {/* Button onder de placeholder */}
        <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-800 py-2 px-4 hover:bg-gray-50 transition-colors">
          <span>Bekijk verhalen</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};

export default NoCoverCategoryCard; 
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ArrowIcon from '../icons/ArrowIcon';

const NoCoverStoryCard = ({ id, title, text, category, onCategoryClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOnVerhalenPage = location.pathname === '/verhalen';
  const selectedCategory = searchParams.get('category');
  const isCategorySelected = selectedCategory === category;

  const handleReadMore = () => {
    navigate(`/verhaal-detail/${id}`);
  };

  const handleCategoryClick = (e) => {
    if (!isCategorySelected) {
      e.stopPropagation();
      navigate(`/verhalen?category=${encodeURIComponent(category)}`);
      // Scroll to top of page after navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to get a preview of the text content
  const getTextPreview = (text) => {
    if (!text) return '';
    // Remove HTML tags and get first 200 characters
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
  };

  return (
    <div className="flex flex-col border-2 border-gray-800 bg-white w-full h-full">
      <div className="p-5 sm:p-6 flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="font-mono text-xl sm:text-2xl mb-4 break-words">{title}</h3>
          <div className="mb-4 overflow-hidden">
            <p className="text-gray-700 text-sm sm:text-base overflow-hidden overflow-ellipsis break-words whitespace-normal line-clamp-4">
              {getTextPreview(text)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-end mb-3">
            {category && (
              <span 
                onClick={onCategoryClick ? (e) => onCategoryClick(e, category) : handleCategoryClick}
                className={`px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs sm:text-sm whitespace-nowrap
                  ${!isCategorySelected ? 'cursor-pointer hover:bg-gray-300' : ''}`}
              >
                {category}
              </span>
            )}
          </div>
          <div>
            <button 
              onClick={handleReadMore}
              className="w-full border-2 border-gray-800 py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base hover:bg-gray-50 transition-colors"
            >
              <span>Lees meer</span>
              <ArrowIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoCoverStoryCard; 
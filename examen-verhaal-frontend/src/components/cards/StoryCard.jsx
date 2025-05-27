import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ArrowIcon from "../icons/ArrowIcon";
import trainImage from "../../assets/images/train.webp";
import RichTextDisplay from "../admin/RichTextDisplay";

const StoryCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  onCategoryClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOnVerhalenPage = location.pathname === "/verhalen";
  const selectedCategory = searchParams.get("category");
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
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col border-2 border-gray-800 bg-white w-full h-full">
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
            <h3 className="font-mono text-base sm:text-lg break-words">
              {title}
            </h3>
            {category && (
              <span
                onClick={
                  onCategoryClick
                    ? (e) => onCategoryClick(e, category)
                    : handleCategoryClick
                }
                className={`px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs sm:text-sm whitespace-nowrap ml-2
                  ${
                    !isCategorySelected
                      ? "cursor-pointer hover:bg-gray-300"
                      : ""
                  }`}
              >
                {category}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="text-gray-700 text-sm sm:text-base overflow-hidden overflow-ellipsis break-words whitespace-normal line-clamp-4">
            <RichTextDisplay content={description} />
            </div>
          </div>
        </div>

        {/* Lees meer button */}
        <div className="mt-auto">
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
  );
};

export default StoryCard;

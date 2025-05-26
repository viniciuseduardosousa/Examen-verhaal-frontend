import StoryActions from './StoryActions';

const StoryHeader = ({ verhaal, categoryMap, onCategoryClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Geen datum beschikbaar";
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <section className="py-8 animate-fadeIn">
      <div className={`grid ${verhaal.cover_image ? 'grid-cols-1 md:grid-cols-2 gap-20' : 'grid-cols-1'}`}>
        {/* Image section */}
        {verhaal.cover_image && (
          <div className="w-full h-80 md:h-96 relative group">
            <div
              className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                         group-hover:translate-x-1 group-hover:translate-y-1 
                         transition-transform duration-200"
            ></div>
            <img
              src={verhaal.cover_image}
              alt={verhaal.titel}
              className="relative w-full h-full object-cover border-2 border-gray-800"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onCategoryClick(verhaal.categorie)}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {categoryMap[verhaal.categorie] || "Onbekende categorie"}
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {formatDate(verhaal.datum)}
              </span>
            </div>
          </div>
        )}

        {/* Text section */}
        <div className="grid grid-rows-[auto_1fr_auto] h-full">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-800 leading-tight">
              {verhaal.titel}
            </h1>
            {!verhaal.cover_image && (
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => onCategoryClick(verhaal.categorie)}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                >
                  {categoryMap[verhaal.categorie] || "Onbekende categorie"}
                </button>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {formatDate(verhaal.datum)}
                </span>
              </div>
            )}
            <p className="text-xl text-gray-600 max-w-2xl mb-6 leading-relaxed font-serif whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {verhaal.beschrijving}
            </p>
          </div>
          <StoryActions verhaal={verhaal} />
        </div>
      </div>
    </section>
  );
};

export default StoryHeader; 
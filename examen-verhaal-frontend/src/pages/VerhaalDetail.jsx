import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verhalenAPI, categoriesAPI } from "../services/api";
import HighlightedStories from "../components/sections/HighlightedStories";
import Divider from "../components/decorative/Divider";

const VerhaalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verhaal, setVerhaal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});
  const [hasHighlightedStories, setHasHighlightedStories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both story and categories
        const [storyData, categoriesData] = await Promise.all([
          verhalenAPI.getById(id),
          categoriesAPI.getAll(),
        ]);

        // Create category map
        const newCategoryMap = {};
        categoriesData.forEach((cat) => {
          newCategoryMap[cat.id] = cat.naam;
        });

        setCategoryMap(newCategoryMap);
        setVerhaal(storyData);
        setError(null);
      } catch (err) {
        setError("Verhaal niet gevonden");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCategoryClick = (categoryId) => {
    const categoryName = categoryMap[categoryId];
    if (categoryName) {
      navigate(`/verhalen?category=${encodeURIComponent(categoryName)}`);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Laden...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  if (!verhaal) {
    return (
      <div className="container mx-auto px-4 py-8">Verhaal niet gevonden</div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/verhalen")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Terug naar verhalen
        </button>
      </div>

      {/* Header Section */}
      <section className="py-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Afbeelding sectie */}
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
                onClick={() => handleCategoryClick(verhaal.categorie)}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {categoryMap[verhaal.categorie] || "Onbekende categorie"}
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {verhaal.datum || "Geen datum beschikbaar"}
              </span>
            </div>
          </div>

          {/* Tekst sectie */}
          <div className="grid grid-rows-[auto_1fr_auto] h-full">
            {/* Titel en beschrijving */}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-800 leading-tight">
                {verhaal.titel}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-6 leading-relaxed font-serif">
                {verhaal.beschrijving}
              </p>
            </div>

            {/* Actie knoppen */}
            <div className="flex flex-col justify-end gap-4">
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                  </svg>
                  Deel
                </button>
                {verhaal.is_downloadable && (
                  <button 
                    onClick={async () => {
                      try {
                        // Open PDF in new tab
                        window.open(verhaal.pdf_file, '_blank');
                        
                        // Download PDF
                        const response = await fetch(verhaal.pdf_file);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${verhaal.titel}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (error) {
                        console.error('Error downloading PDF:', error);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                    Download als PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Story Content Section */}
      <section className="py-8 animate-slideDown">
        <div
          className="prose prose-lg max-w-4xl mx-auto font-serif leading-relaxed text-gray-700
            prose-headings:font-bold prose-headings:text-gray-800
            prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8
            prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6
            prose-p:text-base prose-p:my-8 prose-p:whitespace-pre-line
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-8
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-8
            prose-li:my-4
            prose-table:w-full prose-table:my-8
            prose-tr:border-b prose-tr:border-gray-200
            prose-td:p-3 prose-td:align-top
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-gray-800
            prose-img:rounded-lg prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-8
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-8
            prose-hr:my-12 prose-hr:border-gray-200
            prose-br:block prose-br:my-6
            [&>*:first-child]:mt-0
            [&>*:last-child]:mb-0
            [&>p+p]:mt-8
            [&>h2+h2]:mt-12
            [&>h3+h3]:mt-10
            [&>p+h2]:mt-16
            [&>p+h3]:mt-12
            [&>h2+p]:mt-8
            [&>h3+p]:mt-6
            [&>ul+p]:mt-8
            [&>ol+p]:mt-8
            [&>p+ul]:mt-8
            [&>p+ol]:mt-8
            [&>blockquote+p]:mt-8
            [&>p+blockquote]:mt-8
            [&>img+p]:mt-8
            [&>p+img]:mt-8
            px-4 sm:px-6 md:px-8"
          dangerouslySetInnerHTML={{ __html: verhaal.tekst }}
        />
      </section>

      <Divider show={hasHighlightedStories} />
      <HighlightedStories
        onStoriesLoaded={(hasStories) => setHasHighlightedStories(hasStories)}
      />
    </div>
  );
};

export default VerhaalDetail;

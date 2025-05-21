import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verhalenAPI, categoriesAPI } from "../services/api";
import HighlightedStories from "../components/sections/HighlightedStories";
import Divider from "../components/decorative/Divider";
import BackButton from "../components/story/BackButton";
import StoryHeader from "../components/story/StoryHeader";
import StoryContent from "../components/story/StoryContent";

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
      <BackButton />
      <StoryHeader 
        verhaal={verhaal} 
        categoryMap={categoryMap} 
        onCategoryClick={handleCategoryClick} 
      />
      <Divider />
      <StoryContent tekst={verhaal.tekst} isWordImport={!!verhaal.word_file} />
      <Divider show={hasHighlightedStories} />
      <HighlightedStories
        onStoriesLoaded={(hasStories) => setHasHighlightedStories(hasStories)}
      />
    </div>
  );
};

export default VerhaalDetail;

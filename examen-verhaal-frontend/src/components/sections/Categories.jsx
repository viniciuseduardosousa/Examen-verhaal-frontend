import { useState, useEffect, useMemo } from "react";
import CategoryCard from "../cards/CategoryCard";
import NoCoverCategoryCard from "../cards/NoCoverCategoryCard";
import ArrowIcon from "../icons/ArrowIcon";
import { categoriesAPI } from "../../services/api";
import Loader from "../Loader";

const Categories = ({ onCategoriesLoaded }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getFeatured();
        setCategories(data);
        onCategoriesLoaded(data.length > 0);
        setError(null);
      } catch (err) {
        setError(
          "Er is een fout opgetreden bij het ophalen van de categorieën."
        );
        console.error("Error fetching categories:", err);
        onCategoriesLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onCategoriesLoaded]);

  const renderedCategories = useMemo(() => {
    return categories.map((category) => {
      console.log("Category:", {
        id: category.id,
        naam: category.naam,
        cover_image: category.cover_image,
        hasCoverImage: Boolean(category.cover_image),
      });
      const hasCoverImage =
        category.cover_image &&
        typeof category.cover_image === "string" &&
        category.cover_image.trim() !== "";
      return hasCoverImage ? (
        <CategoryCard
          key={category.id}
          title={category.naam}
          imageUrl={category.cover_image}
          category={category.naam}
        />
      ) : (
        <NoCoverCategoryCard
          key={category.id}
          title={category.naam}
          category={category.naam}
        />
      );
    });
  }, [categories]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-medium">Categorieën</h2>
          </div>
          <Loader size="large" className="py-8" />
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="py-16 text-red-500">{error}</div>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Categorieën</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderedCategories}
        </div>
      </div>
    </section>
  );
};

export default Categories;

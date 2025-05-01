import { useState, useEffect } from 'react';
import CategoryCard from '../cards/CategoryCard';
import ArrowIcon from '../icons/ArrowIcon';
import { adminCategoriesAPI } from '../../services/adminApi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminCategoriesAPI.getFeatured();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de categorieën.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="py-16">Laden...</div>;
  }

  if (error) {
    return <div className="py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-medium">Categorieën</h2>
          <ArrowIcon className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.naam}
              description={category.beschrijving || 'Ontdek onze collectie verhalen in deze categorie.'}
              imageUrl={category.cover_image}
              category={category.naam}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 
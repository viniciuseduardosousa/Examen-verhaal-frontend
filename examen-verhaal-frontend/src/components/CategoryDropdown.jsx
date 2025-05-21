import { useState, useEffect } from 'react';
import { verhalenAPI } from '../services/api';

const CategoryDropdown = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await verhalenAPI.getAll();
        const uniqueCategories = [...new Set(data.map(verhaal => verhaal.category))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de categorieën');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Laden...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-full border-2 border-gray-800 rounded-lg px-3 py-1.5 appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] pr-8"
      style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundSize: "1.5em 1.5em" }}
    >
      <option value="">Alle categorieën</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown; 
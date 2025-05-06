import { useState, useEffect } from 'react';
import { adminVerhalenAPI, adminCategoriesAPI } from '../../services/adminApi';

const EditDialog = ({ isOpen, onClose, onSuccess, data, isCategory }) => {
  const [formData, setFormData] = useState({
    titel: '',
    tekst: '',
    beschrijving: '',
    is_onzichtbaar: false,
    categorie: '',
    date: '',
    coverImage: null,
    is_uitgelicht: false,
    is_spotlighted: false
  });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminCategoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Kon categorieën niet ophalen');
      }
    };

    if (isOpen && !isCategory) {
      fetchCategories();
    }
  }, [isOpen, isCategory]);

  useEffect(() => {
    if (data) {
      console.log('Initializing form data with:', data);
      setFormData({
        titel: data.titel || '',
        tekst: data.tekst || '',
        beschrijving: data.beschrijving || '',
        is_onzichtbaar: data.is_onzichtbaar || false,
        categorie: data.categorie_id?.toString() || '', 
        date: data.datum || '',
        coverImage: data.cover_image || null,
        is_uitgelicht: data.is_uitgelicht || false,
        is_spotlighted: data.is_spotlighted || false
      });
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isCategory) {
        await adminCategoriesAPI.update(data.id, {
          naam: formData.naam,
          is_uitgelicht: formData.is_uitgelicht,
          cover_image: formData.cover_image
        });
      } else {
        const date = new Date(formData.date);
        const formattedDate = date.toISOString().split('T')[0];
        
        const transformedData = {
          titel: formData.titel,
          tekst: formData.tekst,
          beschrijving: formData.beschrijving,
          is_onzichtbaar: formData.is_onzichtbaar,
          categorie: formData.categorie_id,
          datum: formattedDate,
          cover_image: formData.coverImage,
          is_uitgelicht: formData.is_uitgelicht,
          is_spotlighted: formData.is_spotlighted
        };
        console.log('Sending data:', transformedData);
        console.log('Using ID:', data.id);
        await adminVerhalenAPI.update(data.id, transformedData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving:', err);
      setError(err.message || 'Er is iets misgegaan bij het opslaan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {isCategory ? 'Categorie bewerken' : 'Verhaal bewerken'}
        </h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isCategory ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naam
                </label>
                <input
                  type="text"
                  name="naam"
                  value={formData.naam}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Afbeelding
                </label>
                <input
                  type="file"
                  name="cover_image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_uitgelicht"
                    checked={formData.is_uitgelicht}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Uitgelicht
                  </span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  name="titel"
                  value={formData.titel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tekst
                </label>
                <textarea
                  name="tekst"
                  value={formData.tekst}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschrijving
                </label>
                <textarea
                  name="beschrijving"
                  value={formData.beschrijving}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <select
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecteer een categorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.naam}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Afbeelding
                </label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_spotlighted"
                    checked={formData.is_spotlighted}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Spotlight verhaal (wordt getoond op de homepage)
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_uitgelicht"
                    checked={formData.is_uitgelicht}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Uitgelicht verhaal
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_onzichtbaar"
                    checked={formData.is_onzichtbaar}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Verborgen</span>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Bezig met opslaan...' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDialog; 
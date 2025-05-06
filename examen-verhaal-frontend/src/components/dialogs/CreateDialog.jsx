import { useState, useEffect } from 'react';
import { adminVerhalenAPI, adminCategoriesAPI } from '../../services/adminApi';

const CreateDialog = ({ isOpen, onClose, onSave, type }) => {
  const [formData, setFormData] = useState(() => {
    if (type === 'story') {
      return {
        title: '',
        text: '',
        description: '',
        published: true,
        category: '',
        coverImage: null,
        date: new Date().toISOString().split('T')[0],
        is_spotlighted: false
      };
    } else {
      return {
        naam: '',
        is_uitgelicht: false,
        cover_image: null
      };
    }
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

    if (isOpen && type === 'story') {
      fetchCategories();
    }
  }, [isOpen, type]);

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
      let transformedData;
      
      if (type === 'story') {
        console.log('Form data before transform:', formData);
        console.log('Category value:', formData.category);
        console.log('Category type:', typeof formData.category);
        
        // Validate category ID
        if (!formData.category) {
          throw new Error('Selecteer een categorie');
        }

        const categoryId = Number(formData.category);
        if (isNaN(categoryId)) {
          throw new Error('Ongeldige categorie ID');
        }

        const date = new Date(formData.date);
        const formattedDate = date.toISOString().split('T')[0];

        transformedData = {
          titel: formData.title,
          tekst: formData.text,
          beschrijving: formData.description,
          is_onzichtbaar: !formData.published,
          categorie: categoryId,
          datum: formattedDate,
          cover_image: formData.coverImage,
          is_spotlighted: formData.is_spotlighted,
          is_uitgelicht: formData.is_spotlighted,
          is_downloadable: false
        };
        
        console.log('Transformed data:', transformedData);
        console.log('Date being sent:', formattedDate);
      } else {
        transformedData = {
          naam: formData.naam,
          is_uitgelicht: formData.is_uitgelicht,
          cover_image: formData.cover_image
        };
      }

      console.log('Sending data to API:', transformedData);
      await onSave(transformedData);
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
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(type === 'story' ? {
        title: '',
        text: '',
        description: '',
        published: true,
        category: '',
        coverImage: null,
        date: new Date().toISOString().split('T')[0],
        is_spotlighted: false
      } : {
        naam: '',
        is_uitgelicht: false,
        cover_image: null
      });
      setError('');
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {type === 'story' ? 'Nieuw Verhaal' : 'Nieuwe Categorie'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {type === 'story' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschrijving
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecteer een categorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.naam}</option>
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
                  value={formData.date || ''}
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

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Gepubliceerd</label>
              </div>
            </>
          ) : (
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

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="is_uitgelicht"
                  checked={formData.is_uitgelicht}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Uitgelicht</label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 mt-6">
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Bezig...' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDialog; 
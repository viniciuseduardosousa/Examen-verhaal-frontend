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
    is_spotlighted: false,
    is_downloadable: false
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
        is_spotlighted: data.is_spotlighted || false,
        is_downloadable: data.is_downloadable || false
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
          is_spotlighted: formData.is_spotlighted,
          is_downloadable: formData.is_downloadable
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
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
                <div className="space-y-4">
                  <div>
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

                  <div>
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

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_uitgelicht"
                        checked={formData.is_uitgelicht}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-gray-900">Uitgelicht</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
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

                  <div>
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

                  <div>
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

                  <div>
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

                  <div>
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

                  <div>
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

                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_spotlighted"
                        checked={formData.is_spotlighted}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-gray-900">
                        Spotlight verhaal (wordt getoond op de homepage)
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_uitgelicht"
                        checked={formData.is_uitgelicht}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-gray-900">
                        Uitgelicht verhaal
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_downloadable"
                        checked={formData.is_downloadable}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-gray-900">
                        Downloadbaar als PDF
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_onzichtbaar"
                        checked={formData.is_onzichtbaar}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-gray-900">Verborgen</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
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
    </div>
  );
};

export default EditDialog; 
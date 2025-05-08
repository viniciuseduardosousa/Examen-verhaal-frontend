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
    is_downloadable: false,
    naam: '',
    cover_image: null
  });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

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
      console.log('is_downloadable value:', data.is_downloadable, typeof data.is_downloadable);
      if (isCategory) {
        setFormData(prev => ({
          ...prev,
          naam: data.naam || '',
          is_uitgelicht: data.is_uitgelicht || false,
          cover_image: data.cover_image || null
        }));
      } else {
        setFormData(prev => {
          const newFormData = {
            titel: data.titel || '',
            tekst: data.tekst || '',
            beschrijving: data.beschrijving || '',
            is_onzichtbaar: data.is_onzichtbaar === true || data.is_onzichtbaar === 'true',
            categorie: data.categorie?.toString() || '', 
            date: data.datum || '',
            coverImage: data.cover_image || null,
            is_uitgelicht: data.is_uitgelicht === true || data.is_uitgelicht === 'true',
            is_spotlighted: data.is_spotlighted === true || data.is_spotlighted === 'true',
            is_downloadable: data.is_downloadable === true || data.is_downloadable === 'true' || prev.is_downloadable
          };
          console.log('is_downloadable in newFormData:', newFormData.is_downloadable, typeof newFormData.is_downloadable);
          return newFormData;
        });
      }
    }
  }, [data, isCategory]);

  useEffect(() => {
    if (data && data.cover_image) {
      setCoverPreview(typeof data.cover_image === 'string' ? data.cover_image : null);
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
          categorie: formData.categorie,
          datum: formattedDate,
          cover_image: formData.coverImage,
          is_uitgelicht: formData.is_uitgelicht,
          is_spotlighted: formData.is_spotlighted,
          is_downloadable: formData.is_downloadable
        };
        console.log('Sending data:', transformedData);
        console.log('is_downloadable in transformedData:', transformedData.is_downloadable, typeof transformedData.is_downloadable);
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
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      if (files && files[0]) {
        setCoverPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4">
            {isCategory ? 'Categorie bewerken' : 'Verhaal bijwerken'}
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
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Linkerkant */}
                    <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                      <div>
                        <label className="block text-sm font-mono font-bold mb-1">Titel</label>
                        <input
                          type="text"
                          name="titel"
                          value={formData.titel}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#F7F6ED]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono font-bold mb-1">Categorie</label>
                        <select
                          name="categorie"
                          value={formData.categorie || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#F7F6ED]"
                        >
                          <option value="">Selecteer een categorie</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.naam}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-mono font-bold mb-1">Datum</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#F7F6ED]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-center gap-2 text-base font-mono">
                          <input
                            type="checkbox"
                            name="is_uitgelicht"
                            checked={!!formData.is_uitgelicht}
                            onChange={handleChange}
                            className="accent-black"
                          />
                          Uitgelicht
                        </label>
                        <label className="flex items-center gap-2 text-base font-mono">
                          <input
                            type="checkbox"
                            name="is_spotlighted"
                            checked={!!formData.is_spotlighted}
                            onChange={handleChange}
                            className="accent-black"
                          />
                          Spotlight
                        </label>
                        <label className="flex items-center gap-2 text-base font-mono">
                          <input
                            type="checkbox"
                            name="is_downloadable"
                            checked={!!formData.is_downloadable}
                            onChange={handleChange}
                            className="accent-black"
                          />
                          Download als pdf
                        </label>
                      </div>
                    </div>
                    {/* Rechterkant: upload + publiceer-oog */}
                    <div className="flex-1 flex flex-col items-center justify-start min-w-[220px]">
                      <label className="block text-sm font-mono font-bold mb-1 w-full text-center">Vervang omslag foto</label>
                      <div className="relative w-full h-[140px] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-[#D9D9D9] cursor-pointer">
                        <input
                          type="file"
                          name="coverImage"
                          onChange={handleChange}
                          accept="image/*"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          tabIndex="-1"
                        />
                        {coverPreview ? (
                          <img src={coverPreview} alt="Preview omslag" className="object-contain max-h-full max-w-full z-0" />
                        ) : (
                          <span className="text-gray-500 text-lg select-none pointer-events-none z-0">Vervang omslag foto</span>
                        )}
                      </div>
                      {/* Publiceer-oog knop */}
                      <div className="w-full flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, is_onzichtbaar: !prev.is_onzichtbaar }))}
                          className="flex items-center gap-2 text-base font-mono focus:outline-none group"
                          aria-pressed={!formData.is_onzichtbaar}
                          title={!formData.is_onzichtbaar ? 'Verhaal verbergen' : 'Verhaal publiceren'}
                        >
                          {!formData.is_onzichtbaar ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#111">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#111">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                          Publiceer
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-mono font-bold mb-1">Korte beschrijving</label>
                    <textarea
                      name="beschrijving"
                      value={formData.beschrijving}
                      onChange={handleChange}
                      required
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-mono font-bold mb-1">Verhaal</label>
                    <textarea
                      name="tekst"
                      value={formData.tekst}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-mono"
                  >
                    Annuleren
                  </button>
                  {!formData.is_onzichtbaar ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-mono"
                    >
                      {isLoading ? 'Bezig...' : 'Verhaal Publiceren'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 font-mono"
                    >
                      {isLoading ? 'Bezig...' : 'Verhaal Opslaan'}
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDialog; 
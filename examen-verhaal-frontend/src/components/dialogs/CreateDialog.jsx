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
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

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
      let updateData;
      
      if (type === 'story') {
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

        updateData = {
          titel: formData.title,
          tekst: formData.text,
          beschrijving: formData.description,
          is_onzichtbaar: !formData.published,
          categorie: categoryId,
          datum: formattedDate,
          is_spotlighted: formData.is_spotlighted,
          is_uitgelicht: formData.is_spotlighted,
          is_downloadable: false
        };

        // Only include coverImage if there's a file or we want to remove it
        if (formData.coverImage instanceof File) {
          updateData.cover_image = formData.coverImage;
        } else if (removeImage) {
          updateData.remove_image = true;
        }
      } else {
        updateData = {
          naam: formData.naam,
          is_uitgelicht: formData.is_uitgelicht
        };

        // Only include cover_image if there's a file or we want to remove it
        if (formData.cover_image instanceof File) {
          updateData.cover_image = formData.cover_image;
        } else if (removeImage) {
          updateData.remove_image = true;
        }
      }

      await onSave(updateData);
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
        setRemoveImage(false);
      }
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
      setCoverPreview(null);
      setRemoveImage(false);
    }
  }, [isOpen, type]);

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
        className="bg-[#FFFFF5] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
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
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                      <div>
                        <label className="block text-sm font-mono font-bold mb-1">Titel</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#F7F6ED]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono font-bold mb-1">Categorie</label>
                        <select
                          name="category"
                          value={formData.category || ''}
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
                    <div className="flex-1 flex flex-col items-center justify-start min-w-[220px]">
                      <label className="block text-sm font-mono font-bold mb-1 w-full text-center">
                        {coverPreview ? 'Omslagfoto' : 'Voeg omslagfoto toe'}
                      </label>
                      <div className="relative w-full h-[200px] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-[#D9D9D9] cursor-pointer group">
                        <input
                          type="file"
                          name="coverImage"
                          onChange={handleChange}
                          accept="image/*"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          tabIndex="-1"
                        />
                        {coverPreview ? (
                          <>
                            <img src={coverPreview} alt="Preview omslag" className="object-contain max-h-full max-w-full z-0" />
                            <div 
                              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center z-20 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.querySelector('input[name="coverImage"]').click();
                              }}
                            >
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-mono">
                                Klik om te vervangen
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverPreview(null);
                                setFormData(prev => ({ ...prev, coverImage: null }));
                                setRemoveImage(true);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
                              title="Verwijder omslagfoto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_159_301)">
                                <path d="M30 26.6667L22.5 20M22.5 20L15 26.6667M22.5 20V35M38.2312 30.65C40.06 29.7638 41.5047 28.3615 42.3373 26.6644C43.1698 24.9673 43.3429 23.072 42.8291 21.2778C42.3154 19.4836 41.144 17.8925 39.5 16.7557C37.856 15.619 35.8329 15.0012 33.75 15H31.3875C30.82 13.0487 29.7622 11.2372 28.2937 9.70165C26.8251 8.16608 24.9841 6.94641 22.9089 6.13434C20.8338 5.32227 18.5785 4.93892 16.3127 5.01313C14.0469 5.08734 11.8295 5.61716 9.8272 6.56277C7.82491 7.50838 6.08983 8.84516 4.75241 10.4726C3.415 12.1001 2.51004 13.9759 2.10559 15.959C1.70113 17.9421 1.8077 19.9809 2.41727 21.9221C3.02685 23.8633 4.12358 25.6564 5.625 27.1667" stroke="#F3F3F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_159_301">
                                  <rect width="45" height="40" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                            <span className="text-gray-500 text-center text-lg select-none pointer-events-none z-0">Klik om omslagfoto toe te voegen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-mono font-bold mb-1">Korte beschrijving</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-mono font-bold mb-1">Verhaal</label>
                    <textarea
                      name="text"
                      value={formData.text}
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
                  {formData.published ? (
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
            ) : (
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
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Bezig...' : 'Opslaan'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDialog; 